import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateBearerToken(token: string): boolean {
    const validToken = process.env.AUTH_TOKEN || 'valid-token-123';
    
    if (!token || token !== validToken) {
      throw new UnauthorizedException('Token inválido');
    }
    
    return true;
  }
}