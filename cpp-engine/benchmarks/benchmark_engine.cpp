#include "../include/matching_engine.hpp"
#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>
#include <random>
#include <chrono>

int main(int argc, char* argv[]) {
    constexpr size_t NUM_OPERATIONS = 100000;
    constexpr uint32_t RANDOM_SEED = 42;

    std::cout << "==========================================================" << std::endl;
    std::cout << " MTX Matching Engine Microsecond Latency Benchmark" << std::endl;
    std::cout << " Workload: 100,000 synthetic orders (Fixed Seed: " << RANDOM_SEED << ")" << std::endl;
    std::cout << " Mix: 60% resting limit orders, 25% market cross, 15% cancels" << std::endl;
    std::cout << "==========================================================" << std::endl;

    mtx::MatchingEngine engine(10000, 10.0, 30); // 10% band for high-volume benchmark
    std::mt19937 rng(RANDOM_SEED);
    std::uniform_int_distribution<int64_t> price_dist(9600, 10400); // within band
    std::uniform_int_distribution<int64_t> qty_dist(5, 100);
    std::uniform_int_distribution<int> action_dist(1, 100);
    std::uniform_int_distribution<int> side_dist(0, 1);

    std::vector<double> latencies_micros;
    latencies_micros.reserve(NUM_OPERATIONS);

    std::vector<std::string> resting_order_ids;

    auto t_start_total = std::chrono::high_resolution_clock::now();

    for (size_t i = 0; i < NUM_OPERATIONS; ++i) {
        int action = action_dist(rng);
        auto t1 = std::chrono::high_resolution_clock::now();

        if (action <= 15 && !resting_order_ids.empty()) {
            // Cancellation
            size_t idx = rng() % resting_order_ids.size();
            std::string ord_to_cancel = resting_order_ids[idx];
            engine.cancel_order(ord_to_cancel);
        } else {
            // Submission
            std::string ord_id = "BORD-" + std::to_string(i);
            std::string req_id = "BREQ-" + std::to_string(i);
            mtx::Side side = (side_dist(rng) == 0) ? mtx::Side::BUY : mtx::Side::SELL;
            int64_t price = price_dist(rng);
            int64_t qty = qty_dist(rng);

            auto res = engine.submit_order(ord_id, req_id, "BENCH_TRADER", "DEMO", side, price, qty);
            if (res.success && res.order && res.order->remaining_quantity > 0) {
                resting_order_ids.push_back(ord_id);
            }
        }

        auto t2 = std::chrono::high_resolution_clock::now();
        double elapsed_us = std::chrono::duration<double, std::micro>(t2 - t1).count();
        latencies_micros.push_back(elapsed_us);
    }

    auto t_end_total = std::chrono::high_resolution_clock::now();
    double total_seconds = std::chrono::duration<double>(t_end_total - t_start_total).count();

    // Calculate percentiles
    std::sort(latencies_micros.begin(), latencies_micros.end());
    double p50 = latencies_micros[latencies_micros.size() * 50 / 100];
    double p95 = latencies_micros[latencies_micros.size() * 95 / 100];
    double p99 = latencies_micros[latencies_micros.size() * 99 / 100];
    double min_lat = latencies_micros.front();
    double max_lat = latencies_micros.back();
    double avg = std::accumulate(latencies_micros.begin(), latencies_micros.end(), 0.0) / latencies_micros.size();
    double throughput = NUM_OPERATIONS / total_seconds;

    std::cout << "\n--- BENCHMARK RESULTS ---" << std::endl;
    std::cout << "Sample Count      : " << NUM_OPERATIONS << " operations" << std::endl;
    std::cout << "Total Time Elapsed: " << std::fixed << std::setprecision(3) << total_seconds << " s" << std::endl;
    std::cout << "Throughput        : " << std::fixed << std::setprecision(0) << throughput << " ops/sec" << std::endl;
    std::cout << "Latency p50       : " << std::fixed << std::setprecision(2) << p50 << " us" << std::endl;
    std::cout << "Latency p95       : " << std::fixed << std::setprecision(2) << p95 << " us" << std::endl;
    std::cout << "Latency p99       : " << std::fixed << std::setprecision(2) << p99 << " us" << std::endl;
    std::cout << "Latency Average   : " << std::fixed << std::setprecision(2) << avg << " us" << std::endl;
    std::cout << "Latency Min / Max : " << min_lat << " us / " << max_lat << " us" << std::endl;
    std::cout << "==========================================================" << std::endl;

    return 0;
}
