module.exports = {
  apps: [
    {
      name: "am-kp",
      script: "npm",
      args: "run start",
      watch: true,
      instances: "max", // Use all CPU cores
      exec_mode: "cluster", // Cluster mode for better performance
      autorestart: true,
    },
  ],
};
