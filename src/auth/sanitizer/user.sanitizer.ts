import { UrlDocument } from 'src/url-short/url.schema';
import { UserDocument } from 'src/users/users.schema';

export interface SanitizedUser {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  isActive: boolean;
}

export function userSanitizer(user: UserDocument): SanitizedUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
  };
}

export interface SanitizedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  expiresAt: Date | null;
}

export function urlSanitizer(url: UrlDocument): SanitizedUrl {
  return {
    id: url._id.toString(),
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    clickCount: url.clickCount,
    expiresAt: url.expiresAt,
  };
}
