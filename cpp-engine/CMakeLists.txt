cmake_minimum_required(VERSION 3.20)
project(MTXMatchingEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Optimization flags for ultra-low latency
if(MSVC)
    add_compile_options(/O2 /Oi /Ot /GL /W4)
else()
    add_compile_options(-O3 -march=native -Wall -Wextra -Wpedantic)
endif()

include_directories(include)

find_package(Threads REQUIRED)

# Core matching engine server
add_executable(matching_engine_server
    src/main.cpp
)
target_link_libraries(matching_engine_server PRIVATE Threads::Threads)

# Unit test binary
add_executable(matching_engine_tests
    tests/test_engine.cpp
)
target_link_libraries(matching_engine_tests PRIVATE Threads::Threads)

# Repeatable benchmark binary
add_executable(matching_engine_benchmark
    benchmarks/benchmark_engine.cpp
)
target_link_libraries(matching_engine_benchmark PRIVATE Threads::Threads)

enable_testing()
add_test(NAME EngineSpecifications COMMAND matching_engine_tests)
