export class UpdateProfileDto {
  fullName?: string;
  email?: string;
  phone?: string;
  profession?: string;
  bio?: string;

  preferences?: {
    language?: string;
    emailNotifications?: boolean;
    darkMode?: boolean;
    fontSize?: string;
  };
}