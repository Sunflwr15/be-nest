import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // Import the Book entity
  providers: [BookService], // Make sure BookService is listed here as a provider
  controllers: [BookController],
})
export class BookModule {}
