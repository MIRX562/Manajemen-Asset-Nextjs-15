module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./server.js",
      watch: true,
      env: {
        NODE_ENV: "production",
        DATABASE_URL:
          "postgresql://neondb_owner:UZlt2fH0QEud@ep-raspy-haze-a59x6v9m.us-east-2.aws.neon.tech/neondb?sslmode=require",
      },
    },
  ],
};
