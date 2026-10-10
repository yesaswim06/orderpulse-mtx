#pragma once

#include "types.hpp"
#include "order_book.hpp"
#include "circuit_breaker.hpp"
#include <mutex>
#include <string>
#include <vector>
#include <unordered_map>
#include <deque>
#include <atomic>
#include <algorithm>
#include <memory>
#include <chrono>

namespace mtx {

struct IdempotencyPayload {
    std::string order_id;
    std::string participant_id;
    std::string symbol;
    Side side;
    int64_t price_ticks;
    int64_t quantity;

    bool operator==(const IdempotencyPayload& other) const {
        return order_id == other.order_id &&
               participant_id == other.participant_id &&
               symbol == other.symbol &&
               side == other.side &&
               price_ticks == other.price_ticks &&
               quantity == other.quantity;
    }
};

class MatchingEngine {
public:
    explicit MatchingEngine(int64_t initial_reference_ticks = 10000,
                            double band_percent = 5.0,
                            int32_t min_halt_duration_sec = 30)
        : book_("DEMO"),
          breaker_(initial_reference_ticks, band_percent, min_halt_duration_sec),
          sequence_counter_(0),
          start_time_(std::chrono::steady_clock::now()) {}

    SubmitOrderResult submit_order(const std::string& order_id,
                                  const std::string& request_id,
                                  const std::string& participant_id,
                                  const std::string& symbol,
                                  Side side,
                                  int64_t price_ticks,
                                  int64_t quantity) {
        auto t_start = std::chrono::high_resolution_clock::now();
        std::lock_guard<std::mutex> lock(engine_mutex_);

        SubmitOrderResult result;

        // 1. Validation checks
        if (symbol != "DEMO") {
            result.success = false;
            result.error_message = "Unsupported symbol: " + symbol + ". Only 'DEMO' is supported.";
            record_rejection();
            return result;
        }

        if (price_ticks <= 0) {
            result.success = false;
            result.error_message = "Price must be strictly positive (> 0 ticks).";
            record_rejection();
            return result;
        }

        if (quantity <= 0) {
            result.success = false;
            result.error_message = "Quantity must be strictly positive (> 0).";
            record_rejection();
            return result;
        }

        // Numeric overflow safety checks
        constexpr int64_t MAX_SAFE_VAL = 1000000000000LL; // 1 trillion
        if (price_ticks > MAX_SAFE_VAL || quantity > MAX_SAFE_VAL) {
            result.success = false;
            result.error_message = "Numeric overflow protection: price or quantity exceeds maximum permitted limits.";
            record_rejection();
            return result;
        }

        // 2. Idempotency verification
        IdempotencyPayload current_payload{order_id, participant_id, symbol, side, price_ticks, quantity};
        auto req_it = idempotency_map_.find(request_id);
        if (req_it != idempotency_map_.end()) {
            if (req_it->second.payload == current_payload) {
                // Same request ID and same payload: return original result (retry)
                return req_it->second.result;
            } else {
                // Reuse of request ID with different payload: reject
                result.success = false;
                result.error_message = "Idempotency conflict: request_id '" + request_id + "' was already used with a different order payload.";
                record_rejection();
                return result;
            }
        }

        // 3. Circuit breaker acceptance check
        if (!breaker_.can_accept_new_orders()) {
            result.success = false;
            result.error_message = "Trading is currently HALTED by volatility circuit breaker. Order submission rejected.";
            record_rejection();
            return result;
        }

        // 4. Sequencer
        uint64_t seq = ++sequence_counter_;
        result.sequence_id = seq;

        // 5. Construct order
        auto order = std::make_shared<Order>();
        order->order_id = order_id.empty() ? ("ORD-" + std::to_string(seq)) : order_id;
        order->request_id = request_id;
        order->participant_id = participant_id.empty() ? "DEFAULT_TRADER" : participant_id;
        order->symbol = symbol;
        order->side = side;
        order->price_ticks = price_ticks;
        order->original_quantity = quantity;
        order->remaining_quantity = quantity;
        order->status = OrderStatus::NEW;
        order->acceptance_sequence = seq;
        order->timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();

        // 6. Matching against resting orders
        bool halted_during_match = false;
        std::vector<Trade> trades;

        if (side == Side::BUY) {
            auto& asks = book_.get_asks();
            while (order->remaining_quantity > 0 && !asks.empty()) {
                auto best_ask_it = asks.begin();
                int64_t resting_price = best_ask_it->first;

                // Price priority: buy limit must be >= sell limit
                if (order->price_ticks < resting_price) {
                    break;
                }

                // Check candidate execution price with Circuit Breaker BEFORE committing fill
                std::string breaker_reason;
                if (!breaker_.validate_execution_price(resting_price, seq, breaker_reason)) {
                    // Breaker tripped! Do NOT execute this fill.
                    halted_during_match = true;
                    result.breaker_triggered = true;
                    total_breaker_trips_++;
                    break;
                }

                // Match with FIFO queue at this price level
                auto& queue = best_ask_it->second;
                auto resting_order = queue.front();

                int64_t match_qty = std::min(order->remaining_quantity, resting_order->remaining_quantity);

                // Execute trade at RESTING order's price
                Trade trade;
                trade.trade_id = "TRD-" + std::to_string(++trade_counter_);
                trade.symbol = symbol;
                trade.maker_order_id = resting_order->order_id;
                trade.taker_order_id = order->order_id;
                trade.maker_participant_id = resting_order->participant_id;
                trade.taker_participant_id = order->participant_id;
                trade.price_ticks = resting_price;
                trade.quantity = match_qty;
                trade.sequence_id = ++sequence_counter_;
                trade.timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();

                trades.push_back(trade);
                all_trades_.push_back(trade);

                // Update quantities and statuses
                order->remaining_quantity -= match_qty;
                resting_order->remaining_quantity -= match_qty;

                if (resting_order->remaining_quantity == 0) {
                    resting_order->status = OrderStatus::FILLED;
                    queue.pop_front();
                    book_.remove_order(resting_order->order_id);
                } else {
                    resting_order->status = OrderStatus::PARTIALLY_FILLED;
                }

                if (queue.empty()) {
                    asks.erase(best_ask_it);
                }
            }
        } else { // SELL
            auto& bids = book_.get_bids();
            while (order->remaining_quantity > 0 && !bids.empty()) {
                auto best_bid_it = bids.begin();
                int64_t resting_price = best_bid_it->first;

                // Price priority: sell limit must be <= buy limit
                if (order->price_ticks > resting_price) {
                    break;
                }

                // Check candidate execution price with Circuit Breaker BEFORE committing fill
                std::string breaker_reason;
                if (!breaker_.validate_execution_price(resting_price, seq, breaker_reason)) {
                    // Breaker tripped! Do NOT execute this fill.
                    halted_during_match = true;
                    result.breaker_triggered = true;
                    total_breaker_trips_++;
                    break;
                }

                // Match with FIFO queue at this price level
                auto& queue = best_bid_it->second;
                auto resting_order = queue.front();

                int64_t match_qty = std::min(order->remaining_quantity, resting_order->remaining_quantity);

                // Execute trade at RESTING order's price
                Trade trade;
                trade.trade_id = "TRD-" + std::to_string(++trade_counter_);
                trade.symbol = symbol;
                trade.maker_order_id = resting_order->order_id;
                trade.taker_order_id = order->order_id;
                trade.maker_participant_id = resting_order->participant_id;
                trade.taker_participant_id = order->participant_id;
                trade.price_ticks = resting_price;
                trade.quantity = match_qty;
                trade.sequence_id = ++sequence_counter_;
                trade.timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();

                trades.push_back(trade);
                all_trades_.push_back(trade);

                // Update quantities and statuses
                order->remaining_quantity -= match_qty;
                resting_order->remaining_quantity -= match_qty;

                if (resting_order->remaining_quantity == 0) {
                    resting_order->status = OrderStatus::FILLED;
                    queue.pop_front();
                    book_.remove_order(resting_order->order_id);
                } else {
                    resting_order->status = OrderStatus::PARTIALLY_FILLED;
                }

                if (queue.empty()) {
                    bids.erase(best_bid_it);
                }
            }
        }

        // Finalize incoming order status
        if (order->remaining_quantity == 0) {
            order->status = OrderStatus::FILLED;
        } else if (order->remaining_quantity < order->original_quantity) {
            order->status = OrderStatus::PARTIALLY_FILLED;
            if (!halted_during_match) {
                book_.add_order(order);
            }
        } else {
            order->status = OrderStatus::NEW;
            if (!halted_during_match) {
                book_.add_order(order);
            }
        }

        order_history_[order->order_id] = order;
        total_orders_accepted_++;
        total_trades_executed_ += trades.size();

        result.success = true;
        result.order = order;
        result.generated_trades = trades;

        // Record for idempotency
        idempotency_map_[request_id] = {current_payload, result};

        // Latency metric
        auto t_end = std::chrono::high_resolution_clock::now();
        double micros = std::chrono::duration<double, std::micro>(t_end - t_start).count();
        record_latency(micros);

        return result;
    }

    CancelOrderResult cancel_order(const std::string& order_id, const std::string& participant_id = "") {
        auto t_start = std::chrono::high_resolution_clock::now();
        std::lock_guard<std::mutex> lock(engine_mutex_);

        CancelOrderResult result;
        uint64_t seq = ++sequence_counter_;
        result.sequence_id = seq;

        auto resting_order = book_.find_order(order_id);
        if (!resting_order) {
            auto hist_it = order_history_.find(order_id);
            if (hist_it != order_history_.end()) {
                result.success = false;
                result.error_message = "Order cannot be cancelled: order is already in state " +
                                       status_to_string(hist_it->second->status) + ".";
            } else {
                result.success = false;
                result.error_message = "Order not found with order_id: " + order_id;
            }
            return result;
        }

        if (resting_order->remaining_quantity <= 0) {
            result.success = false;
            result.error_message = "Order has no remaining quantity to cancel.";
            return result;
        }

        // Optional participant check if provided
        if (!participant_id.empty() && resting_order->participant_id != participant_id) {
            result.success = false;
            result.error_message = "Unauthorized: participant ID mismatch.";
            return result;
        }

        // Remove from book and mark CANCELLED
        book_.remove_order(order_id);
        resting_order->status = OrderStatus::CANCELLED;
        total_orders_cancelled_++;

        result.success = true;
        result.cancelled_order = resting_order;

        auto t_end = std::chrono::high_resolution_clock::now();
        double micros = std::chrono::duration<double, std::micro>(t_end - t_start).count();
        record_latency(micros);

        return result;
    }

    // Resolves compatible resting orders after resume deterministically.
    // Execution price rule for crossed resting orders:
    // The order with earlier acceptance_sequence (the resting order that was posted earlier)
    // establishes the execution price.
    std::vector<Trade> match_crossed_resting_orders() {
        std::vector<Trade> trades;
        auto& bids = book_.get_bids();
        auto& asks = book_.get_asks();

        while (!bids.empty() && !asks.empty()) {
            auto best_bid_it = bids.begin();
            auto best_ask_it = asks.begin();

            if (best_bid_it->first < best_ask_it->first) {
                break; // Not crossed
            }

            auto& bid_queue = best_bid_it->second;
            auto& ask_queue = best_ask_it->second;

            if (bid_queue.empty() || ask_queue.empty()) break;

            auto top_bid = bid_queue.front();
            auto top_ask = ask_queue.front();

            // Execution price rule: older resting order determines execution price
            int64_t exec_price = (top_bid->acceptance_sequence < top_ask->acceptance_sequence)
                                     ? top_bid->price_ticks
                                     : top_ask->price_ticks;

            std::string breaker_reason;
            if (!breaker_.validate_execution_price(exec_price, ++sequence_counter_, breaker_reason)) {
                // Trip breaker again if candidate crosses band
                total_breaker_trips_++;
                break;
            }

            int64_t match_qty = std::min(top_bid->remaining_quantity, top_ask->remaining_quantity);

            Trade trade;
            trade.trade_id = "TRD-" + std::to_string(++trade_counter_);
            trade.symbol = "DEMO";
            trade.maker_order_id = top_ask->acceptance_sequence < top_bid->acceptance_sequence ? top_ask->order_id : top_bid->order_id;
            trade.taker_order_id = top_ask->acceptance_sequence < top_bid->acceptance_sequence ? top_bid->order_id : top_ask->order_id;
            trade.maker_participant_id = top_ask->acceptance_sequence < top_bid->acceptance_sequence ? top_ask->participant_id : top_bid->participant_id;
            trade.taker_participant_id = top_ask->acceptance_sequence < top_bid->acceptance_sequence ? top_bid->participant_id : top_ask->participant_id;
            trade.price_ticks = exec_price;
            trade.quantity = match_qty;
            trade.sequence_id = ++sequence_counter_;
            trade.timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(
                std::chrono::system_clock::now().time_since_epoch()).count();

            trades.push_back(trade);
            all_trades_.push_back(trade);

            top_bid->remaining_quantity -= match_qty;
            top_ask->remaining_quantity -= match_qty;

            if (top_bid->remaining_quantity == 0) {
                top_bid->status = OrderStatus::FILLED;
                bid_queue.pop_front();
                book_.remove_order(top_bid->order_id);
            } else {
                top_bid->status = OrderStatus::PARTIALLY_FILLED;
            }

            if (top_ask->remaining_quantity == 0) {
                top_ask->status = OrderStatus::FILLED;
                ask_queue.pop_front();
                book_.remove_order(top_ask->order_id);
            } else {
                top_ask->status = OrderStatus::PARTIALLY_FILLED;
            }

            if (bid_queue.empty()) bids.erase(best_bid_it);
            if (ask_queue.empty()) asks.erase(best_ask_it);
        }

        total_trades_executed_ += trades.size();
        return trades;
    }

    bool resume(const std::string& operator_token, const std::string& expected_token, std::string& out_error, std::vector<Trade>& out_resumed_trades) {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        uint64_t seq = ++sequence_counter_;
        if (!breaker_.resume(seq, operator_token, expected_token, out_error)) {
            return false;
        }

        // After resume, process compatible resting orders deterministically
        out_resumed_trades = match_crossed_resting_orders();
        return true;
    }

    bool reset_reference_price(int64_t new_reference_ticks, const std::string& reason,
                               const std::string& operator_token, const std::string& expected_token, std::string& out_error) {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        uint64_t seq = ++sequence_counter_;
        return breaker_.reset_reference_price(new_reference_ticks, reason, seq, operator_token, expected_token, out_error);
    }

    OrderBookSnapshot get_book_snapshot() {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        return book_.get_snapshot(sequence_counter_.load());
    }

    BreakerStatus get_breaker_status() {
        return breaker_.get_status();
    }

    std::vector<Trade> get_recent_trades(size_t limit = 50) {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        std::vector<Trade> result;
        size_t count = std::min(limit, all_trades_.size());
        result.reserve(count);
        for (auto it = all_trades_.rbegin(); it != all_trades_.rend() && result.size() < count; ++it) {
            result.push_back(*it);
        }
        return result;
    }

    std::vector<std::shared_ptr<Order>> get_orders(size_t limit = 100) {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        std::vector<std::shared_ptr<Order>> result;
        for (auto it = order_history_.rbegin(); it != order_history_.rend() && result.size() < limit; ++it) {
            result.push_back(it->second);
        }
        return result;
    }

    EngineMetrics get_metrics() {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        EngineMetrics m;
        m.total_orders_accepted = total_orders_accepted_;
        m.total_orders_rejected = total_orders_rejected_;
        m.total_orders_cancelled = total_orders_cancelled_;
        m.total_trades_executed = total_trades_executed_;
        m.total_breaker_trips = total_breaker_trips_;
        m.sequence_number = sequence_counter_.load();
        m.last_processing_latency_micros = last_latency_micros_;

        auto now = std::chrono::steady_clock::now();
        double uptime_sec = std::chrono::duration<double>(now - start_time_).count();
        m.uptime_seconds = static_cast<int64_t>(uptime_sec);
        m.orders_per_second = uptime_sec > 0 ? (total_orders_accepted_ / uptime_sec) : 0;

        if (!latency_reservoir_.empty()) {
            std::vector<double> sorted = latency_reservoir_;
            std::sort(sorted.begin(), sorted.end());
            m.p50_latency_micros = sorted[sorted.size() * 50 / 100];
            m.p95_latency_micros = sorted[sorted.size() * 95 / 100];
            m.p99_latency_micros = sorted[sorted.size() * 99 / 100];
        }

        return m;
    }

    uint64_t current_sequence() const {
        return sequence_counter_.load();
    }

    void reset_state() {
        std::lock_guard<std::mutex> lock(engine_mutex_);
        book_.clear();
        order_history_.clear();
        idempotency_map_.clear();
        all_trades_.clear();
        latency_reservoir_.clear();
        total_orders_accepted_ = 0;
        total_orders_rejected_ = 0;
        total_orders_cancelled_ = 0;
        total_trades_executed_ = 0;
        total_breaker_trips_ = 0;
        sequence_counter_ = 0;
        trade_counter_ = 0;
    }

private:
    void record_rejection() {
        total_orders_rejected_++;
    }

    void record_latency(double micros) {
        last_latency_micros_ = micros;
        if (latency_reservoir_.size() < 10000) {
            latency_reservoir_.push_back(micros);
        } else {
            // Reservoir sampling replacement
            latency_reservoir_[rand() % 10000] = micros;
        }
    }

    struct StoredIdempotency {
        IdempotencyPayload payload;
        SubmitOrderResult result;
    };

    mutable std::mutex engine_mutex_;
    OrderBook book_;
    CircuitBreaker breaker_;
    std::atomic<uint64_t> sequence_counter_;
    std::atomic<uint64_t> trade_counter_{0};

    std::unordered_map<std::string, StoredIdempotency> idempotency_map_;
    std::unordered_map<std::string, std::shared_ptr<Order>> order_history_;
    std::vector<Trade> all_trades_;

    uint64_t total_orders_accepted_{0};
    uint64_t total_orders_rejected_{0};
    uint64_t total_orders_cancelled_{0};
    uint64_t total_trades_executed_{0};
    uint64_t total_breaker_trips_{0};

    double last_latency_micros_{0.0};
    std::vector<double> latency_reservoir_;
    std::chrono::steady_clock::time_point start_time_;
};

} // namespace mtx
