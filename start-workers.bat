@echo off
echo Starting all workers...

start "Notifications Worker" cmd /k "npm run worker:notifications"
start "Driver Assignment Worker" cmd /k "npm run worker:driver"
start "Admin Worker" cmd /k "npm run worker:admin"
start "Analytics Worker" cmd /k "npm run worker:analytics"
start "Cleanup Worker" cmd /k "npm run worker:cleanup"

echo All workers started!