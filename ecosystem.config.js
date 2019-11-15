module.exports = {
  apps: [
    {
      name: 'pnlab-server',
      script: './server.bundle.js',
      exec_mode: 'cluster',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: -1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
