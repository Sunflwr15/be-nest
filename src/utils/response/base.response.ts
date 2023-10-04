// import { ResponseSuccess, ResponsePagination } from "src/interface";

import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';

class BaseResponse {
  _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {},
    };
  }

  _pagination(
    message: string,
    data: any,
    pageSize: number,
    totalData: number,
    page: number,
  ): ResponsePagination {
    return {
      status: 'Success',
      message: message,
      pagination: {
        total: totalData,
        page: page,
        pageSize: pageSize,
      },
      data: data,
    };
  }
}

export default BaseResponse;
