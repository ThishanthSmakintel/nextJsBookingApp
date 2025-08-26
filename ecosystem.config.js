export default {
  apps: [
    {
      name: 'car-booking-app',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'notifications-worker',
      script: 'workers/notifications.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'driver-worker',
      script: 'workers/driver-assignment.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'admin-worker',
      script: 'workers/admin.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'analytics-worker',
      script: 'workers/analytics.js',
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'cleanup-worker',
      script: 'workers/cleanup.js',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}