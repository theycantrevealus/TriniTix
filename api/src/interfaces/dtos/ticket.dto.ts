import { IsString, IsUUID } from 'class-validator';
import { TicketModel } from '../../model/ticket.model';
import { ApiProperty } from '@nestjs/swagger';

export class TicketDto implements Readonly<TicketDto> {
  @IsUUID()
  uid: string;

  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsUUID()
  creator: string;

  @IsUUID()
  status: string;

  @IsString()
  created_at: Date;

  @IsString()
  updated_at: Date;

  @IsString()
  deleted_at: Date;

  public static from(dto: Partial<TicketDto>) {
    const it = new TicketDto();
    it.uid = dto.uid;
    it.code = dto.code;
    it.title = dto.title;
    it.content = dto.content;
    it.creator = dto.creator;
    it.status = dto.status;
    it.created_at = dto.created_at;
    it.updated_at = dto.updated_at;
    it.deleted_at = dto.deleted_at;
    return it;
  }

  public static createModel(entity: TicketModel) {
    return this.from({
      uid: entity.uid,
      code: entity.code,
      title: entity.title,
      content: entity.content,
      creator: entity.creator,
      status: entity.status,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}

export class TicketInputDTO {
  @ApiProperty({
    example: 'Judul Tiket',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })
  @IsString()
  content: string;
}
