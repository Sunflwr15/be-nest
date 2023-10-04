import { Controller, Get, Param } from '@nestjs/common';

@Controller('latihan')
export class LatihanController {
  @Get()
  findAll() {
    return {
      Method: 'GET',
    };
  }
  @Get('detail/:id')
  findById(@Param('id') id: string) {
    return {
      Method: 'GET',
      Param: {
        id: id,
      },
    };
  }
}
