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
