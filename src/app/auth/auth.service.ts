import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { compare, hash } from 'bcrypt'; //import hash
import { ResponseSuccess } from 'src/interface/response.interface';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private jwtService: JwtService, // panggil kelas jwt service
  ) {
    super();
  }

  generatJWT(payload: jwtPayload, expiresIn: string | number, secret: string) {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save(payload);
    const data = {
      nama: payload.nama,
      email: payload.email,
      password: payload.password,
    };
    return this._success('Register Berhasil', data);
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );
    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generatJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      ); //expired untuk access token adalah 1 hari dari ketika di buat
      const refresh_token = await this.generatJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      ); //expired untuk access token adalah 7 hari dari ketika di buat
      await this.authRepository.save({
        refresh_token: refresh_token,
        access_token: access_token,
        id: checkUserExists.id,
      }); // simpan refresh token ke dalam tabel
      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token, // tambakan access_token ketika return
        refresh_token: refresh_token, // tambakan refresh_token ketika return
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        // role: true,
        created_at: true,
      },
    });

    return this._success('OK', user);
  }
}
