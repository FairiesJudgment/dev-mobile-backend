
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService) {
    super({
      usernameField : 'email',
      passwordField : 'password',
    });
  }

  async validate(email : string, password : string): Promise<any> {
    const loginDto : LoginDto = {
      email : email,
      password : password,
    };
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException("Email ou mot de passe incorrect");
    }
    return user;
  }
}
