import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, BearerStrategy],
  exports: [AuthService],
})
export class AuthModule {}