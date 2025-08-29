export async function checkPermission(userId, resource, action) {
  // Temporary: allow all permissions for development
  return true
}

export async function assignPermissions(userId, permissions) {
  // Temporary: always return success
  return true
}

export async function getUserPermissions(userId) {
  // Temporary: return empty permissions
  return []
}