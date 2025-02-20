export default {
  apps: [
    {
      name: "am-kp",
      script: "server.js",
      watch: true,
      instances: 4,
      exec_mode: "fork",
      autorestart: true,
    },
  ],
};
