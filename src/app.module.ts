import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BookModule } from './book/book.module';
import { AuthController } from './app/auth/auth.controller';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    LatihanModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
