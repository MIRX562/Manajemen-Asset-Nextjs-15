import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "5s", target: 50 }, // Start with 10 VUs
    { duration: "10s", target: 100 }, // Ramp up to 50 VUs
    { duration: "15s", target: 400 }, // Ramp up to 100 VUs
    { duration: "20s", target: 900 }, // Ramp up to 200 VUs
  ],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  let res = http.get("https://test.mirx.my.id"); // Replace with your target URL
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time is < 1000ms": (r) => r.timings.duration < 1000,
  });

  sleep(0.5); // Shorter wait time between requests
}
