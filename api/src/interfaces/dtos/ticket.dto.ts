import { IsString, IsUUID } from 'class-validator';
import { TicketModel } from '../../model/ticket.model';

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
      status: entity.status,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}
