export const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data || ''),
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data || '')
}

export async function logToDatabase(level, message, data) {
  // Simple console logging for now
  console.log(`[${level.toUpperCase()}] ${message}`, data || '')
  return true
}