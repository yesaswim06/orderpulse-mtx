#pragma once

#include "types.hpp"
#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include <atomic>
#include <string>
#include <vector>
#include <memory>
#include <functional>

namespace mtx {

enum class JournalEventType {
    ORDER_ACCEPTED,
    ORDER_CANCELLED,
    TRADE_EXECUTED,
    BREAKER_HALTED,
    BREAKER_RESUMED,
    REFERENCE_RESET
};

struct JournalEntry {
    uint64_t sequence_id;
    JournalEventType event_type;
    std::string payload_json;
    int64_t timestamp_ns;
};

class PersistenceWorker {
public:
    explicit PersistenceWorker(size_t max_queue_capacity = 100000)
        : max_capacity_(max_queue_capacity),
          running_(false),
          persisted_sequence_(0),
          persistence_failures_(0),
          is_healthy_(true) {}

    ~PersistenceWorker() {
        stop();
    }

    void start() {
        running_ = true;
        worker_thread_ = std::thread(&PersistenceWorker::run, this);
    }

    void stop() {
        if (running_) {
            running_ = false;
            cv_.notify_all();
            if (worker_thread_.joinable()) {
                worker_thread_.join();
            }
        }
    }

    // Non-blocking enqueue into bounded persistence queue (matching loop is not stalled)
    bool enqueue_event(const JournalEntry& entry) {
        std::lock_guard<std::mutex> lock(queue_mutex_);
        if (queue_.size() >= max_capacity_) {
            persistence_failures_++;
            is_healthy_ = false;
            return false;
        }
        queue_.push(entry);
        cv_.notify_one();
        return true;
    }

    uint64_t get_persisted_sequence() const {
        return persisted_sequence_.load();
    }

    uint64_t get_failure_count() const {
        return persistence_failures_.load();
    }

    bool is_healthy() const {
        return is_healthy_.load();
    }

    size_t get_queue_size() {
        std::lock_guard<std::mutex> lock(queue_mutex_);
        return queue_.size();
    }

private:
    void run() {
        while (running_) {
            std::unique_lock<std::mutex> lock(queue_mutex_);
            cv_.wait(lock, [this] {
                return !running_ || !queue_.empty();
            });

            while (!queue_.empty()) {
                JournalEntry entry = queue_.front();
                queue_.pop();
                lock.unlock();

                // Persist entry to PostgreSQL / WAL journal
                bool success = write_to_store(entry);
                if (success) {
                    persisted_sequence_ = entry.sequence_id;
                } else {
                    persistence_failures_++;
                }

                lock.lock();
            }
        }
    }

    bool write_to_store(const JournalEntry& entry) {
        // Mock / libpq persistence write
        // In full Postgres environment, executes INSERT INTO engine_events ON CONFLICT DO NOTHING
        return true;
    }

    size_t max_capacity_;
    std::atomic<bool> running_;
    std::atomic<uint64_t> persisted_sequence_;
    std::atomic<uint64_t> persistence_failures_;
    std::atomic<bool> is_healthy_;
    std::queue<JournalEntry> queue_;
    std::mutex queue_mutex_;
    std::condition_variable cv_;
    std::thread worker_thread_;
};

} // namespace mtx
