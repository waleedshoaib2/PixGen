import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor (private userService:UserService){}

    async validateUser(username:string, password:string): Promise<string> {
        const user = await this.userService.findByUsername(username)

        if(!user){
            throw new UnauthorizedException("Invalid User or Password")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid username or password');
        }
    
        const payload: JwtPayload = { username: user.username, sub: user.id };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      }
    }




