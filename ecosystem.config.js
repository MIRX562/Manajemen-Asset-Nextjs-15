export default {
  apps: [
    {
      name: "am-kp",
      script: "npm",
      args: "run start",
      watch: true,
      instances: 4,
      exec_mode: "fork",
      autorestart: true,
    },
  ],
};
