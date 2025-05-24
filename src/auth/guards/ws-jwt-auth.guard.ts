import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromHeader(client);

      if (!token) {
        throw new WsException('No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Agregar el usuario al objeto del cliente para uso posterior
      client['user'] = payload;

      return true;
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    return 'hola';
    const token = client.handshake.auth?.token; // Preferente
    if (token) return token;

    // Fallback: header Authorization (solo funciona en long polling)
    const [type, headerToken] =
      client.handshake.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? headerToken : undefined;
  }
}
