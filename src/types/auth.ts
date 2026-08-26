export type UserRole = "ADMIN" | "TEAM" | "JUDGE" | "PUBLIC";

export interface UserSession {
  uid: string;
  role: UserRole;
  teamId?: string; // If role === 'TEAM'
  displayName: string;
  email?: string;
  authenticatedAt: number;
}

export interface TeamCredential {
  teamId: string;
  teamName: string;
  shortName: string;
  passcode: string;
}
