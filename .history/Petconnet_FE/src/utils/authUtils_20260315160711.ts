/**
 * Decode JWT token and extract claims
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("[decodeToken] Invalid token format");
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    console.log("[decodeToken] Decoded token claims:", decoded);
    return decoded;
  } catch (e) {
    console.error("[decodeToken] Error decoding token:", e);
    return null;
  }
}

/**
 * Decode JWT token and extract role claim
 */
export function extractRoleFromToken(token: string): string | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    // JWT standard role claim is "role", but it can also be in "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    const role =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    console.log("[extractRoleFromToken] Extracted role:", role);
    return role ? String(role) : null;
  } catch (e) {
    console.error("[extractRoleFromToken] Error extracting role:", e);
    return null;
  }
}

/**
 * Extract user ID from token (usually in 'sub' or 'nameid' claim)
 */
export function extractUserIdFromToken(token: string): string | null {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    const userId =
      decoded.userId ||
      decoded.sub ||
      decoded.nameid ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    console.log("[extractUserIdFromToken] Extracted userId:", userId);
    return userId ? String(userId) : null;
  } catch (e) {
    console.error("[extractUserIdFromToken] Error extracting user id:", e);
    return null;
  }
}

export function isAdminRole(role: unknown): boolean {
  if (!role) return false;

  if (Array.isArray(role)) {
    return role.some((r) => typeof r === "string" && r.toLowerCase() === "admin");
  }

  if (typeof role === "string") {
    const lower = role.toLowerCase().trim();
    if (lower === "admin") return true;
    const parts = role.split(/[,;|]/).map((p) => p.trim().toLowerCase());
    return parts.includes("admin");
  }

  if (role && typeof role === "object") {
    const roleObj = role as Record<string, unknown>;
    const maybe = roleObj.role ?? roleObj.name ?? roleObj.type;
    if (maybe && typeof maybe === "string") {
      return maybe.toLowerCase() === "admin";
    }
  }

  return false;
}

export function isStaffRole(role: unknown): boolean {
  if (!role) return false;

  if (Array.isArray(role)) {
    return role.some((r) => typeof r === "string" && r.toLowerCase() === "staff");
  }

  if (typeof role === "string") {
    const lower = role.toLowerCase().trim();
    if (lower === "staff") return true;
    const parts = role.split(/[,;|]/).map((p) => p.trim().toLowerCase());
    return parts.includes("staff");
  }

  if (role && typeof role === "object") {
    const roleObj = role as Record<string, unknown>;
    const maybe = roleObj.role ?? roleObj.name ?? roleObj.type;
    if (maybe && typeof maybe === "string") {
      return maybe.toLowerCase() === "staff";
    }
  }

  return false;
}

