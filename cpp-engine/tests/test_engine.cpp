#include "../include/matching_engine.hpp"
#include <iostream>
#include <cassert>
#include <vector>

void test_best_price_and_fifo() {
    std::cout << "[Test 1] Best-price priority and FIFO queueing..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // Place resting sells at different prices
    engine.submit_order("S1", "R1", "P1", "DEMO", mtx::Side::SELL, 10200, 50); // Rs 102
    engine.submit_order("S2", "R2", "P2", "DEMO", mtx::Side::SELL, 10100, 50); // Rs 101 (Better price)
    engine.submit_order("S3", "R3", "P3", "DEMO", mtx::Side::SELL, 10100, 50); // Rs 101 (Same price, later time)

    // Incoming buy at Rs 103 for 60 shares
    // Should match S2 first (50 @ 101), then S3 (10 @ 101)
    auto res = engine.submit_order("B1", "R4", "P4", "DEMO", mtx::Side::BUY, 10300, 60);
    assert(res.success);
    assert(res.generated_trades.size() == 2);
    assert(res.generated_trades[0].maker_order_id == "S2");
    assert(res.generated_trades[0].quantity == 50);
    assert(res.generated_trades[0].price_ticks == 10100);

    assert(res.generated_trades[1].maker_order_id == "S3");
    assert(res.generated_trades[1].quantity == 10);
    assert(res.generated_trades[1].price_ticks == 10100);

    std::cout << "  -> PASSED: Best price and FIFO verified." << std::endl;
}

void test_resting_order_execution_price() {
    std::cout << "[Test 2] Resting-order execution price rule..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // Resting sell at Rs 100 (10000 ticks)
    engine.submit_order("S1", "R1", "P1", "DEMO", mtx::Side::SELL, 10000, 100);

    // Aggressive incoming buy at Rs 104 (10400 ticks)
    auto res = engine.submit_order("B1", "R2", "P2", "DEMO", mtx::Side::BUY, 10400, 50);
    assert(res.success);
    assert(res.generated_trades.size() == 1);
    // Crucial rule: Execution must be at resting order's price (10000 ticks), NOT incoming buy price
    assert(res.generated_trades[0].price_ticks == 10000);

    std::cout << "  -> PASSED: Executed at resting price (10000 ticks)." << std::endl;
}

void test_partial_fills_and_quantity_conservation() {
    std::cout << "[Test 3] Partial fills and quantity conservation..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // Resting sell: 100 shares @ Rs 100
    engine.submit_order("S1", "R1", "P1", "DEMO", mtx::Side::SELL, 10000, 100);

    // Buy 40 shares @ Rs 100
    auto res = engine.submit_order("B1", "R2", "P2", "DEMO", mtx::Side::BUY, 10000, 40);
    assert(res.success);
    assert(res.order->status == mtx::OrderStatus::FILLED);
    assert(res.order->remaining_quantity == 0);

    auto book = engine.get_book_snapshot();
    assert(book.asks.size() == 1);
    assert(book.asks[0].total_quantity == 60); // 100 - 40 = 60 conserved

    std::cout << "  -> PASSED: 40 filled, 60 retained in resting book." << std::endl;
}

void test_cancellation_before_and_after_fill() {
    std::cout << "[Test 4] Cancellation before and after fills..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    engine.submit_order("S1", "R1", "P1", "DEMO", mtx::Side::SELL, 10000, 100);
    
    // Partially fill 30
    engine.submit_order("B1", "R2", "P2", "DEMO", mtx::Side::BUY, 10000, 30);

    // Cancel remaining 70
    auto cancel_res = engine.cancel_order("S1");
    assert(cancel_res.success);
    assert(cancel_res.cancelled_order->status == mtx::OrderStatus::CANCELLED);
    assert(cancel_res.cancelled_order->remaining_quantity == 70);

    // Attempting to cancel again must fail
    auto second_cancel = engine.cancel_order("S1");
    assert(!second_cancel.success);

    std::cout << "  -> PASSED: Partial fill cancellation verified." << std::endl;
}

void test_duplicate_requests_and_conflicts() {
    std::cout << "[Test 5] Duplicate requests and idempotency conflicts..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // First submission
    auto res1 = engine.submit_order("ORD1", "REQ-ABC", "P1", "DEMO", mtx::Side::BUY, 9900, 50);
    assert(res1.success);

    // Exact retry with same request_id and same payload -> returns original result
    auto res2 = engine.submit_order("ORD1", "REQ-ABC", "P1", "DEMO", mtx::Side::BUY, 9900, 50);
    assert(res2.success);
    assert(res2.order->order_id == res1.order->order_id);

    // Conflict: same request_id with DIFFERENT payload -> rejected
    auto res3 = engine.submit_order("ORD2", "REQ-ABC", "P1", "DEMO", mtx::Side::BUY, 9950, 100);
    assert(!res3.success);
    assert(res3.error_message.find("Idempotency conflict") != std::string::npos);

    std::cout << "  -> PASSED: Retry accepted, conflicting payload rejected." << std::endl;
}

void test_invalid_values_and_limits() {
    std::cout << "[Test 6] Invalid values and numeric limits..." << std::endl;
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // Nonpositive price
    auto r1 = engine.submit_order("O1", "R1", "P1", "DEMO", mtx::Side::BUY, 0, 50);
    assert(!r1.success);

    // Nonpositive quantity
    auto r2 = engine.submit_order("O2", "R2", "P2", "DEMO", mtx::Side::BUY, 10000, -5);
    assert(!r2.success);

    // Unsupported symbol
    auto r3 = engine.submit_order("O3", "R3", "P3", "AAPL", mtx::Side::BUY, 10000, 50);
    assert(!r3.success);

    std::cout << "  -> PASSED: Invalid values safely rejected." << std::endl;
}

void test_circuit_breaker_exact_bands_and_breach() {
    std::cout << "[Test 7] Circuit breaker: exact bands (Rs 95 & Rs 105) vs 1-tick breach..." << std::endl;
    // Ref: 10000 ticks (Rs 100.00). Band +/-5% -> [9500, 10500]
    mtx::MatchingEngine engine(10000, 5.0, 30);

    // 1. Trade exactly at Rs 105.00 (10500 ticks) - ALLOWED
    engine.submit_order("S105", "R1", "P1", "DEMO", mtx::Side::SELL, 10500, 10);
    auto res_upper = engine.submit_order("B105", "R2", "P2", "DEMO", mtx::Side::BUY, 10500, 10);
    assert(res_upper.success);
    assert(!res_upper.breaker_triggered);
    assert(res_upper.generated_trades.size() == 1);
    assert(engine.get_breaker_status().state == mtx::BreakerState::RUNNING);

    // 2. Trade exactly at Rs 95.00 (9500 ticks) - ALLOWED
    engine.submit_order("B95", "R3", "P3", "DEMO", mtx::Side::BUY, 9500, 10);
    auto res_lower = engine.submit_order("S95", "R4", "P4", "DEMO", mtx::Side::SELL, 9500, 10);
    assert(res_lower.success);
    assert(!res_lower.breaker_triggered);
    assert(res_lower.generated_trades.size() == 1);
    assert(engine.get_breaker_status().state == mtx::BreakerState::RUNNING);

    // 3. Candidate trade 1 tick outside upper boundary: Rs 105.01 (10501 ticks)
    engine.submit_order("S_SHOCK", "R5", "P5", "DEMO", mtx::Side::SELL, 10501, 20);
    auto res_shock = engine.submit_order("B_SHOCK", "R6", "P6", "DEMO", mtx::Side::BUY, 10505, 20);
    // Breaker must trip! Candidate trade rejected, no trade executed!
    assert(res_shock.breaker_triggered);
    assert(res_shock.generated_trades.empty());
    assert(engine.get_breaker_status().state == mtx::BreakerState::HALTED);

    // 4. While halted: new order submissions rejected
    auto res_halted = engine.submit_order("B_BLOCKED", "R7", "P7", "DEMO", mtx::Side::BUY, 10000, 10);
    assert(!res_halted.success);
    assert(res_halted.error_message.find("HALTED") != std::string::npos);

    // 5. While halted: cancellations ARE permitted
    auto res_cancel = engine.cancel_order("S_SHOCK");
    assert(res_cancel.success);

    std::cout << "  -> PASSED: Boundary enforcement and halt state verified." << std::endl;
}

int main() {
    std::cout << "=========================================" << std::endl;
    std::cout << "MTX Matching Engine Test Suite" << std::endl;
    std::cout << "=========================================" << std::endl;

    test_best_price_and_fifo();
    test_resting_order_execution_price();
    test_partial_fills_and_quantity_conservation();
    test_cancellation_before_and_after_fill();
    test_duplicate_requests_and_conflicts();
    test_invalid_values_and_limits();
    test_circuit_breaker_exact_bands_and_breach();

    std::cout << "=========================================" << std::endl;
    std::cout << "ALL 7 ENGINE SPECIFICATION SUITES PASSED!" << std::endl;
    std::cout << "=========================================" << std::endl;
    return 0;
}
