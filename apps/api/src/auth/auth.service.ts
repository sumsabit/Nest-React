import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/registerDto.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

async register(dto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.usersService.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: 'user', // 🔒 FORCE THIS
  });

  await this.mailerService.sendMail({
    to: user.email,
    subject: 'Welcome!',
    text: `Hello ${user.name}, welcome to the ethiopian guidance system!`,
  });

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    message: 'User registered successfully',
    token: this.jwtService.sign(payload),
    user,
  };

}


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

 async login(user: any) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
 async forgotPassword(email: string) {
  const user = await this.usersService.findByEmail(email);

  // Always return same response (security best practice)
  if (!user) {
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  const token = crypto.randomBytes(32).toString('hex');

  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await this.usersService.save(user);

  // ✅ FRONTEND LINK (FIXED)
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  await this.mailerService.sendMail({
    to: user.email,
    subject: 'Reset Your Password',
    html: `
      <h3>Password Reset</h3>
      <p>Hello ${user.name},</p>
      <p>Click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  });

  return { message: 'Reset password email sent' };
}
async resetPassword(token: string, newPassword: string) {
  const user = await this.usersService.findByResetToken(token);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new BadRequestException('Invalid or expired token');
  }

  user.password = await bcrypt.hash(newPassword, 10);

  // better cleanup
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await this.usersService.save(user);

  return { message: 'Password reset successful' };
}
}