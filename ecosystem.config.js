module.exports = {
  apps: [
    {
      name: "zen-server-api",
      script: "api/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        API_PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
    },
    {
      name: "zen-server-frontend",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
    },
  ],
};
