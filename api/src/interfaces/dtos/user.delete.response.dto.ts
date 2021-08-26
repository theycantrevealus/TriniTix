import { HttpStatus } from '@nestjs/common';

export const userDeleteRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_delete_success',
  error: null,
};

export const userDeleteRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'user_delete_failed',
  error:
    'User failed to delete. Might be your provided data is not valid to system',
};
