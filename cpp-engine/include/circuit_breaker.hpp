#pragma once

#include "types.hpp"
#include <mutex>
#include <string>
#include <chrono>
#include <optional>
#include <vector>

namespace mtx {

struct BreakerAuditRecord {
    std::string event_type;
    int64_t old_reference_ticks{0};
    int64_t new_reference_ticks{0};
    int64_t candidate_ticks{0};
    std::string reason;
    uint64_t sequence_id{0};
    int64_t timestamp_ms{0};
};

class CircuitBreaker {
public:
    explicit CircuitBreaker(int64_t initial_reference_ticks = 10000,
                            double band_percent = 5.0,
                            int32_t min_halt_duration_sec = 30)
        : reference_price_ticks_(initial_reference_ticks),
          band_percent_(band_percent),
          min_halt_duration_sec_(min_halt_duration_sec),
          state_(BreakerState::RUNNING) {
        recompute_bands();
    }

    // Evaluates whether a candidate trade price is within the safe volatility band.
    // If it violates the band, trips the breaker into HALTED state.
    bool validate_execution_price(int64_t candidate_price_ticks, uint64_t sequence_id, std::string& out_reason) {
        std::lock_guard<std::mutex> lock(mutex_);
        update_state_internal();

        if (state_ == BreakerState::HALTED) {
            out_reason = "Circuit breaker is currently HALTED. No trades allowed.";
            return false;
        }

        if (candidate_price_ticks < lower_band_ticks_ || candidate_price_ticks > upper_band_ticks_) {
            state_ = BreakerState::HALTED;
            halt_start_time_ms_ = current_time_ms();
            last_breach_candidate_ticks_ = candidate_price_ticks;
            last_breaker_sequence_ = sequence_id;

            std::ostringstream ss;
            ss << "Volatility Band Breached: Candidate trade at Rs "
               << std::fixed << std::setprecision(2) << ticks_to_rupees(candidate_price_ticks)
               << " is outside permitted band [Rs "
               << ticks_to_rupees(lower_band_ticks_) << " - Rs "
               << ticks_to_rupees(upper_band_ticks_) << "]. Reference: Rs "
               << ticks_to_rupees(reference_price_ticks_) << " (+/- " << band_percent_ << "%).";
            last_halt_reason_ = ss.str();
            out_reason = last_halt_reason_;

            audit_log_.push_back({
                "HALT",
                reference_price_ticks_,
                reference_price_ticks_,
                candidate_price_ticks,
                last_halt_reason_,
                sequence_id,
                halt_start_time_ms_
            });

            return false;
        }

        return true;
    }

    bool can_accept_new_orders() {
        std::lock_guard<std::mutex> lock(mutex_);
        update_state_internal();
        return state_ == BreakerState::RUNNING;
    }

    bool can_cancel_orders() {
        // Cancellations are explicitly permitted during HALTED and READY_TO_RESUME
        return true;
    }

    bool resume(uint64_t sequence_id, const std::string& operator_token, const std::string& expected_token, std::string& out_error) {
        std::lock_guard<std::mutex> lock(mutex_);
        update_state_internal();

        if (operator_token != expected_token) {
            out_error = "Invalid demo admin token. Administrative authorization required.";
            return false;
        }

        if (state_ == BreakerState::RUNNING) {
            out_error = "Trading engine is already RUNNING.";
            return false;
        }

        if (state_ == BreakerState::HALTED) {
            int64_t elapsed_sec = (current_time_ms() - halt_start_time_ms_) / 1000;
            if (elapsed_sec < min_halt_duration_sec_) {
                out_error = "Minimum halt duration not yet elapsed. Remaining: " +
                            std::to_string(min_halt_duration_sec_ - elapsed_sec) + "s.";
                return false;
            }
        }

        state_ = BreakerState::RUNNING;
        last_halt_reason_ = "";
        last_breach_candidate_ticks_ = std::nullopt;

        audit_log_.push_back({
            "RESUME",
            reference_price_ticks_,
            reference_price_ticks_,
            0,
            "Operator initiated resume after cooling period",
            sequence_id,
            current_time_ms()
        });

        return true;
    }

    bool reset_reference_price(int64_t new_reference_ticks, const std::string& reason, uint64_t sequence_id,
                               const std::string& operator_token, const std::string& expected_token, std::string& out_error) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (operator_token != expected_token) {
            out_error = "Invalid demo admin token. Administrative authorization required.";
            return false;
        }

        if (new_reference_ticks <= 0) {
            out_error = "Reference price ticks must be strictly positive.";
            return false;
        }

        int64_t old_reference = reference_price_ticks_;
        reference_price_ticks_ = new_reference_ticks;
        recompute_bands();

        audit_log_.push_back({
            "REFERENCE_RESET",
            old_reference,
            new_reference_ticks,
            0,
            reason.empty() ? "Operator manual reference reset" : reason,
            sequence_id,
            current_time_ms()
        });

        return true;
    }

    BreakerStatus get_status() {
        std::lock_guard<std::mutex> lock(mutex_);
        update_state_internal();

        BreakerStatus status;
        status.state = state_;
        status.reference_price_ticks = reference_price_ticks_;
        status.band_percent = band_percent_;
        status.lower_band_ticks = lower_band_ticks_;
        status.upper_band_ticks = upper_band_ticks_;
        status.min_halt_duration_seconds = min_halt_duration_sec_;
        status.halt_start_time_ms = halt_start_time_ms_;
        status.last_halt_reason = last_halt_reason_;
        status.last_breach_candidate_ticks = last_breach_candidate_ticks_;
        status.last_breaker_sequence = last_breaker_sequence_;
        status.settings_label = "Trading Simulation Demo Policy (Not Official Exchange Rules)";

        if (state_ == BreakerState::HALTED) {
            int64_t elapsed_sec = (current_time_ms() - halt_start_time_ms_) / 1000;
            status.remaining_halt_seconds = static_cast<int32_t>(std::max<int64_t>(0, min_halt_duration_sec_ - elapsed_sec));
        } else {
            status.remaining_halt_seconds = 0;
        }

        return status;
    }

    std::vector<BreakerAuditRecord> get_audit_log() {
        std::lock_guard<std::mutex> lock(mutex_);
        return audit_log_;
    }

private:
    void recompute_bands() {
        int64_t delta = static_cast<int64_t>(std::llround(reference_price_ticks_ * (band_percent_ / 100.0)));
        lower_band_ticks_ = reference_price_ticks_ - delta;
        upper_band_ticks_ = reference_price_ticks_ + delta;
    }

    void update_state_internal() {
        if (state_ == BreakerState::HALTED) {
            int64_t elapsed_sec = (current_time_ms() - halt_start_time_ms_) / 1000;
            if (elapsed_sec >= min_halt_duration_sec_) {
                state_ = BreakerState::READY_TO_RESUME;
            }
        }
    }

    static int64_t current_time_ms() {
        return std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
    }

    mutable std::mutex mutex_;
    int64_t reference_price_ticks_;
    double band_percent_;
    int64_t lower_band_ticks_;
    int64_t upper_band_ticks_;
    int32_t min_halt_duration_sec_;
    BreakerState state_;
    int64_t halt_start_time_ms_{0};
    std::string last_halt_reason_{""};
    std::optional<int64_t> last_breach_candidate_ticks_;
    uint64_t last_breaker_sequence_{0};
    std::vector<BreakerAuditRecord> audit_log_;
};

} // namespace mtx
