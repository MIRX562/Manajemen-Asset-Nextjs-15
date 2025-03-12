/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 100, // Number of virtual users
  duration: "5m", // Test duration
};

export default function () {
  let res = http.get("https://test.mirx.my.id/auth"); // Replace with your target URL
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time is < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(1); // Wait 1 second before the next request
}
