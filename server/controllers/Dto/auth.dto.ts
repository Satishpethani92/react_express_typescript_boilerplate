import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export enum UserStatusEnum {
  PENDING = "pending",
  VERIFIED = "verified",
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export declare type DecodedUserDto = {
  id: string;
};

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  userName!: string;
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        "Password must have at least one uppercase, lowercase, number, and special character",
    }
  )
  password!: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsString()
  password!: string;
}
