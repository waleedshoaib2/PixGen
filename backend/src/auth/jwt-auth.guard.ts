import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";



@Injectable()
export class JwtAuthModule extends AuthGuard('jwt'){
}