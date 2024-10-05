import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
