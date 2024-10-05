import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtMiddleware } from './auth/jwt.middleware';
import { PromptModule } from './prompt/prompt.module';
import { PdfModule } from './pdf/pdf.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type:'postgres',
      url:process.env.DATABASE_URL,
      autoLoadEntities:true,
      logging:true,
      synchronize:true
    }),
    UserModule,
    AuthModule,
    PromptModule,
    PdfModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure (consumer: MiddlewareConsumer){
    consumer.apply(JwtMiddleware).forRoutes({path: 'user', method: RequestMethod.ALL})
  }
}
