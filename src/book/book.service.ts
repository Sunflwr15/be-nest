import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import { FindBookDto } from './book.dto';
import { table } from 'console';
import BaseResponse from 'src/utils/response/base.response';

@Injectable()
export class BookService extends BaseResponse {
  //inject book repository ke service

  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  //inject book repository ke service

  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'HTML CSS',
      author: 'ihsanabuhanifah',
      year: 2023,
    },
  ];

  async getAllBooks(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, title, author, from_year, to_year } = query;

    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }
    const total = await this.bookRepository.count();
    const [list, count] = await this.bookRepository.findAndCount({
      order: {
        // created_at: 'ESC',
      },
      where: filter,
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    });
    const data = await this.bookRepository.find();
    return this._pagination('ok', list, pageSize, count, page);
  }

  async createBook(payload): Promise<ResponseSuccess> {
    try {
      const data = await this.bookRepository.save(payload);
      return this._success('Berhasil Membuat', data);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  // Get Detail
  // Update
  async getBooksDetail(id: number): Promise<ResponseSuccess> {
    console.log(id);
    const data = await this.bookRepository.findOne({ where: { id } });
    console.log(data);
    if (data === null) {
      throw new HttpException(
        `Buku dengan id ${id} tidak ditemukan`,
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      status: 'Success',
      message: 'List Buku ditemukan',
      data: data,
    };
  }
  //Delete
}
