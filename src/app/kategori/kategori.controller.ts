import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  findAllKategori,
  findDetailKategori,
  updateKategori,
} from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@Body() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }
  @Post('createBulk')
  async createBull(@Body() payload: CreateKategoriDto[]) {
    return this.kategoriService.createBulk(payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getAllCategory(query);
  }
  @Get('list/:nama_kategori')
  async getDetailCategory(@Param('nama_kategori') nama_kategori: string) {
    //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getDetailCategory(nama_kategori);
  }

  @Put('update/:id')
  async update(@Body() payload: updateKategori, @Param('id') id: number) {
    return this.kategoriService.update(payload.nama_kategori, id);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.kategoriService.delete(id);
  }
}
