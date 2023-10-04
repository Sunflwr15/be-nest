import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto, CreateBookDto, FindBookDto } from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  GetAllBook(@Pagination() query: FindBookDto) {
    console.log({ query });
    return this.bookService.getAllBooks(query);
  }

  @Post('create')
  CreateBook(@Body() payload: CreateBookDto) {
    return this.bookService.createBook(payload);
    // return payload;
  }

  @Get('detail/:id')
  GetDetail(@Param('id') id: number) {
    return this.bookService.getBooksDetail(id);
  }
}
