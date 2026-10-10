#pragma once

#include <string>
#include <cstdint>
#include <chrono>
#include <vector>
#include <optional>
#include <iomanip>
#include <sstream>

namespace mtx {

enum class Side {
    BUY,
    SELL
};

inline std::string side_to_string(Side side) {
    return side == Side::BUY ? "BUY" : "SELL";
}

inline std::optional<Side> string_to_side(const std::string& str) {
    if (str == "BUY" || str == "buy") return Side::BUY;
    if (str == "SELL" || str == "sell") return Side::SELL;
    return std::nullopt;
}

enum class OrderStatus {
    NEW,
    PARTIALLY_FILLED,
    FILLED,
    CANCELLED,
    REJECTED
};

inline std::string status_to_string(OrderStatus status) {
    switch (status) {
        case OrderStatus::NEW: return "NEW";
        case OrderStatus::PARTIALLY_FILLED: return "PARTIALLY_FILLED";
        case OrderStatus::FILLED: return "FILLED";
        case OrderStatus::CANCELLED: return "CANCELLED";
        case OrderStatus::REJECTED: return "REJECTED";
        default: return "UNKNOWN";
    }
}

enum class BreakerState {
    RUNNING,
    HALTED,
    READY_TO_RESUME
};

inline std::string breaker_state_to_string(BreakerState state) {
    switch (state) {
        case BreakerState::RUNNING: return "RUNNING";
        case BreakerState::HALTED: return "HALTED";
        case BreakerState::READY_TO_RESUME: return "READY_TO_RESUME";
        default: return "UNKNOWN";
    }
}

inline double ticks_to_rupees(int64_t ticks) {
    return static_cast<double>(ticks) / 100.0;
}

inline int64_t rupees_to_ticks(double rupees) {
    return static_cast<int64_t>(std::llround(rupees * 100.0));
}

struct Order {
    std::string order_id;
    std::string request_id;
    std::string participant_id;
    std::string symbol{"DEMO"};
    Side side;
    int64_t price_ticks{0};
    int64_t original_quantity{0};
    int64_t remaining_quantity{0};
    OrderStatus status{OrderStatus::NEW};
    uint64_t acceptance_sequence{0};
    int64_t timestamp_ns{0};
};

struct Trade {
    std::string trade_id;
    std::string symbol{"DEMO"};
    std::string maker_order_id;
    std::string taker_order_id;
    std::string maker_participant_id;
    std::string taker_participant_id;
    int64_t price_ticks{0};
    int64_t quantity{0};
    uint64_t sequence_id{0};
    int64_t timestamp_ns{0};
};

struct PriceLevel {
    int64_t price_ticks{0};
    int64_t total_quantity{0};
    size_t order_count{0};
};

struct OrderBookSnapshot {
    std::string symbol{"DEMO"};
    uint64_t sequence_id{0};
    std::vector<PriceLevel> bids;
    std::vector<PriceLevel> asks;
    std::optional<int64_t> best_bid_ticks;
    std::optional<int64_t> best_ask_ticks;
    std::optional<int64_t> spread_ticks;
    int64_t timestamp_ns{0};
};

struct BreakerStatus {
    BreakerState state{BreakerState::RUNNING};
    int64_t reference_price_ticks{10000}; // Rs 100.00
    double band_percent{5.0};             // +/- 5%
    int64_t lower_band_ticks{9500};       // Rs 95.00
    int64_t upper_band_ticks{10500};      // Rs 105.00
    int32_t min_halt_duration_seconds{30};
    int64_t halt_start_time_ms{0};
    int32_t remaining_halt_seconds{0};
    std::string last_halt_reason{""};
    std::optional<int64_t> last_breach_candidate_ticks;
    uint64_t last_breaker_sequence{0};
    std::string settings_label{"Trading Simulation Demo Policy"};
};

struct EngineMetrics {
    uint64_t total_orders_accepted{0};
    uint64_t total_orders_rejected{0};
    uint64_t total_orders_cancelled{0};
    uint64_t total_trades_executed{0};
    uint64_t total_breaker_trips{0};
    double last_processing_latency_micros{0.0};
    double p50_latency_micros{0.0};
    double p95_latency_micros{0.0};
    double p99_latency_micros{0.0};
    double orders_per_second{0.0};
    uint64_t sequence_number{0};
    int64_t uptime_seconds{0};
};

struct SubmitOrderResult {
    bool success{false};
    std::string error_message{""};
    std::shared_ptr<Order> order{nullptr};
    std::vector<Trade> generated_trades;
    bool breaker_triggered{false};
    uint64_t sequence_id{0};
};

struct CancelOrderResult {
    bool success{false};
    std::string error_message{""};
    std::shared_ptr<Order> cancelled_order{nullptr};
    uint64_t sequence_id{0};
};

} // namespace mtx
