import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Kategori } from './kategori.entity';
import { CreateKategoriDto, findAllKategori } from './kategori.dto';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async createBulk(payload: CreateKategoriDto[]): Promise<ResponseSuccess> {
    console.log(payload);
    try {
      const kategoris = payload.map(
        (kategoriDto) => (
          console.log(kategoriDto),
          {
            ...kategoriDto,
            created_by: { id: this.req.user.id },
          }
        ),
      );

        await this.kategoriRepository.save(kategoris);

      return this._success('Bulk create successful', payload);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async delete(id: number): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({ where: { id } });
      if (!kategori) {
        throw new NotFoundException('Kategori tidak ditemukan');
      }
      const deletedKategori = this.kategoriRepository.delete(id);
      return this._success(`Berhasil menghapus kategori dengan id ${id}`);
    } catch (error) {}
  }

  async update(nama_kategori: string, id: number): Promise<ResponseSuccess> {
    try {
      const kategori = await this.kategoriRepository.findOne({ where: { id } });
      if (!kategori) {
        throw new NotFoundException('Kategori tidak ditemukan');
      }
      kategori.nama_kategori = nama_kategori;
      kategori.updated_by = this.req.user.id;
      const updatedKategori = await this.kategoriRepository.save(kategori);

      return this._success('Berhasil Update', updatedKategori);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getDetailCategory(nama_kategori: string): Promise<ResponseSuccess> {
    console.log(nama_kategori);
    //   const filterQuery: {
    //     [key: string]: any;
    //   } = {};

    //   if (nama_kategori) {
    //     filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    //   }
    const result = await this.kategoriRepository.findOne({
      where: { nama_kategori },
      // where: { nama_kategori: Like(`%${nama_kategori}%`) },
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
    });
    console.log(result);
    if (!result) {
      throw new HttpException(
        `Nama Kategori '${nama_kategori}' tidak ditemukan`,
        HttpStatus.BAD_GATEWAY,
      );
    }
    return this._success('OK', result);
  }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori } = query;

    // const filterQuery = {};

    const filterQuery: {
      [key: string]: any;
    } = {};

    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: (Number(page) - 1) * Number(pageSize),
      //   skip: ,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
}
