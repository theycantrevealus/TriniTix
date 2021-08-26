import { IsString, IsUUID } from 'class-validator';
import { TicketStatusModel } from '../../model/ticket.status.model';

export class TicketStatusDto implements Readonly<TicketStatusDto> {
  @IsUUID()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  created_at: Date;

  @IsString()
  updated_at: Date;

  @IsString()
  deleted_at: Date;

  public static from(dto: Partial<TicketStatusDto>) {
    const it = new TicketStatusDto();
    it.uid = dto.uid;
    it.name = dto.name;
    it.created_at = dto.created_at;
    it.updated_at = dto.updated_at;
    it.deleted_at = dto.deleted_at;
    return it;
  }

  public static createModel(entity: TicketStatusModel) {
    return this.from({
      uid: entity.uid,
      name: entity.name,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}
