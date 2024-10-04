import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
//allows decorator to be registered in DI, really important
@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(ConfigService:ConfigService)
{
    super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration:false,
        secretOrKey:ConfigService.get<string>('JWT_SECRET')
    });
}
async validate (payload:any){
        return{userId: payload.sub}
}
}