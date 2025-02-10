module.exports = {
  apps: [
    {
      name: "am-kp",
      script: "npm",
      args: "run start",
      watch: true,
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
    },
  ],
};
