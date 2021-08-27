import { ApiProperty } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';
import { HttpStatus } from '@nestjs/common';

export class TicketResponseDto {
  @ApiProperty({ example: 'get_all_ticket_success' })
  message: string;

  @ApiProperty({
    example: {
      data: [],
    },
    nullable: true,
  })
  data: [TicketDto];
}

//============================================================CREATE SECTION

export const ticketCreateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_create_success',
  error: null,
};

export const ticketCreateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_create_failed',
  error: null,
};

//============================================================UPDATE SECTION

export const ticketUpdateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_create_success',
  error: null,
};

export const ticketUpdateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_create_failed',
  error: null,
};

//============================================================DELETE SECTION

export const ticketDeleteRequestSuccess = {
  status: HttpStatus.OK,
  message: 'ticket_status_delete_success',
  error: null,
};

export const ticketDeleteRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'ticket_status_delete_failed',
  error: null,
};
