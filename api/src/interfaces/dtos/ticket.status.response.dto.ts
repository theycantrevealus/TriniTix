import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class TicketStatusResponseDto {
  @ApiProperty({ example: 'get_all_ticket_success' })
  message: string;

  @ApiProperty({
    example: {
      data: [],
    },
    nullable: true,
  })
  data: [];
}

//============================================================CREATE SECTION

export const ticketStatusCreateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_create_success',
  error: null,
};

export const ticketStatusCreateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_create_failed',
  error: null,
};

export const ticketStatusCreateRequestDup = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_create_duplicate',
  error: null,
};

//============================================================DELETE SECTION

export const ticketStatusDeleteRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_delete_success',
  error: null,
};

export const ticketStatusDeleteRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_delete_failed',
  error: null,
};

//============================================================UPDATE SECTION

export const ticketStatusUpdateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_update_success',
  error: null,
};

export const ticketStatusUpdateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_update_failed',
  error: null,
};
