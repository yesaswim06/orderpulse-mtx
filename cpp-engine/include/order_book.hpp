#pragma once

#include "types.hpp"
#include <map>
#include <list>
#include <unordered_map>
#include <memory>
#include <optional>
#include <vector>

namespace mtx {

class OrderBook {
public:
    explicit OrderBook(std::string symbol = "DEMO") : symbol_(std::move(symbol)) {}

    void add_order(const std::shared_ptr<Order>& order) {
        if (order->side == Side::BUY) {
            auto& queue = bids_[order->price_ticks];
            queue.push_back(order);
            auto it = --queue.end();
            order_index_[order->order_id] = {Side::BUY, order->price_ticks, it};
        } else {
            auto& queue = asks_[order->price_ticks];
            queue.push_back(order);
            auto it = --queue.end();
            order_index_[order->order_id] = {Side::SELL, order->price_ticks, it};
        }
    }

    bool remove_order(const std::string& order_id) {
        auto it = order_index_.find(order_id);
        if (it == order_index_.end()) {
            return false;
        }

        const auto& locator = it->second;
        if (locator.side == Side::BUY) {
            auto level_it = bids_.find(locator.price_ticks);
            if (level_it != bids_.end()) {
                level_it->second.erase(locator.queue_iterator);
                if (level_it->second.empty()) {
                    bids_.erase(level_it);
                }
            }
        } else {
            auto level_it = asks_.find(locator.price_ticks);
            if (level_it != asks_.end()) {
                level_it->second.erase(locator.queue_iterator);
                if (level_it->second.empty()) {
                    asks_.erase(level_it);
                }
            }
        }

        order_index_.erase(it);
        return true;
    }

    std::shared_ptr<Order> find_order(const std::string& order_id) const {
        auto it = order_index_.find(order_id);
        if (it == order_index_.end()) {
            return nullptr;
        }
        return *(it->second.queue_iterator);
    }

    std::optional<int64_t> best_bid() const {
        if (bids_.empty()) return std::nullopt;
        return bids_.begin()->first;
    }

    std::optional<int64_t> best_ask() const {
        if (asks_.empty()) return std::nullopt;
        return asks_.begin()->first;
    }

    std::optional<int64_t> spread() const {
        auto bb = best_bid();
        auto ba = best_ask();
        if (bb.has_value() && ba.has_value()) {
            return ba.value() - bb.value();
        }
        return std::nullopt;
    }

    std::map<int64_t, std::list<std::shared_ptr<Order>>, std::greater<int64_t>>& get_bids() {
        return bids_;
    }

    std::map<int64_t, std::list<std::shared_ptr<Order>>, std::less<int64_t>>& get_asks() {
        return asks_;
    }

    OrderBookSnapshot get_snapshot(uint64_t sequence_id) const {
        OrderBookSnapshot snapshot;
        snapshot.symbol = symbol_;
        snapshot.sequence_id = sequence_id;
        snapshot.best_bid_ticks = best_bid();
        snapshot.best_ask_ticks = best_ask();
        snapshot.spread_ticks = spread();

        auto now = std::chrono::system_clock::now().time_since_epoch();
        snapshot.timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(now).count();

        // Top 20 levels of bids
        size_t count = 0;
        for (const auto& [price, orders] : bids_) {
            if (++count > 20) break;
            int64_t total_qty = 0;
            for (const auto& ord : orders) {
                total_qty += ord->remaining_quantity;
            }
            snapshot.bids.push_back({price, total_qty, orders.size()});
        }

        // Top 20 levels of asks
        count = 0;
        for (const auto& [price, orders] : asks_) {
            if (++count > 20) break;
            int64_t total_qty = 0;
            for (const auto& ord : orders) {
                total_qty += ord->remaining_quantity;
            }
            snapshot.asks.push_back({price, total_qty, orders.size()});
        }

        return snapshot;
    }

    void clear() {
        bids_.clear();
        asks_.clear();
        order_index_.clear();
    }

private:
    struct OrderLocator {
        Side side;
        int64_t price_ticks;
        std::list<std::shared_ptr<Order>>::iterator queue_iterator;
    };

    std::string symbol_;
    std::map<int64_t, std::list<std::shared_ptr<Order>>, std::greater<int64_t>> bids_;
    std::map<int64_t, std::list<std::shared_ptr<Order>>, std::less<int64_t>> asks_;
    std::unordered_map<std::string, OrderLocator> order_index_;
};

} // namespace mtx
