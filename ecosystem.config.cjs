module.exports = {
  apps: [
    {
      name: 'just-trust-bot',
      script: './build/src/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 