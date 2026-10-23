export const UserRole = {
  ADMIN: "ADMIN",
  THERAPIST: "THERAPIST",
  CASHIER: "CASHIER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const GenderLane = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;
export type GenderLane = (typeof GenderLane)[keyof typeof GenderLane];

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: GenderLane;
}

export interface AuthSession {
  user: SessionUser | null;
  expires: string;
}

/**
 * Demo credential check for staff members (Admin & Therapist)
 * In production this bridges to Auth.js / NextAuth Prisma adapter
 */
export async function authenticateStaffCredentials(
  email: string,
  _password: string
): Promise<SessionUser | null> {
  const normalizedEmail = email.toLowerCase().trim();

  // Pre-configured staff accounts for development & operational testing
  if (normalizedEmail === "admin@bekamsmart.com") {
    return {
      id: "usr_admin_001",
      name: "Ustadz Hasan (Admin & Pemilik Bekam Bintan)",
      email: "admin@bekamsmart.com",
      role: UserRole.ADMIN,
      gender: GenderLane.MALE,
    };
  }

  if (normalizedEmail === "terapis.ikhwan@bekamsmart.com") {
    return {
      id: "usr_therapist_001",
      name: "Ustadz Hasan (Praktisi ITBI Bintan)",
      email: "terapis.ikhwan@bekamsmart.com",
      role: UserRole.THERAPIST,
      gender: GenderLane.MALE,
    };
  }

  if (normalizedEmail === "terapis.akhwat@bekamsmart.com") {
    return {
      id: "usr_therapist_002",
      name: "Ummu Aisyah (Kepala Terapis Akhwat)",
      email: "terapis.akhwat@bekamsmart.com",
      role: UserRole.THERAPIST,
      gender: GenderLane.FEMALE,
    };
  }

  return null;
}

export function hasRole(user: SessionUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
