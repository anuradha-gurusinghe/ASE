export interface UserDetails {
  _id?: string;
  password?: string;
  email?: string;
  verifiedStatus?: string;
  name?: string;
  role?: string;
  medium?: string;
  primaryPhone?: string;
  gender?: string;
  premiumStatus?: string;
  googleId?: string;
  facebookId?: string;
  isFirstTime?: string;
  sharedWith?: string[];
  otpCode?: string;
  currency?: string;
}

export enum VerifyStatus {
  BLOCKED = "BLOCKED",
  VERIFIED = "VERIFIED",
}