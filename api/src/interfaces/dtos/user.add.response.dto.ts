import { HttpStatus } from '@nestjs/common';

export const userCreateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_create_success',
  error: null,
};

export const userCreateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'user_create_failed',
  error: null,
};

export const userCreateRequestDup = {
  status: HttpStatus.FORBIDDEN,
  message: 'user_duplicated',
  error: null,
};
