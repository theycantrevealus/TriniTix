import { IsString, IsUUID } from 'class-validator';
import { UserModel } from '../../model/user.model';

export class UserDTO implements Readonly<UserDTO> {
  @IsUUID()
  uid: string;

  @IsString()
  email: string;

  @IsString()
  full_name: string;

  @IsString()
  password: string;

  @IsString()
  created_at: Date;

  @IsString()
  updated_at: Date;

  @IsString()
  deleted_at: Date;

  public static from(dto: Partial<UserDTO>) {
    const it = new UserDTO();
    it.uid = dto.uid;
    it.email = dto.email;
    it.full_name = dto.full_name;
    it.password = dto.password;
    it.created_at = dto.created_at;
    it.updated_at = dto.updated_at;
    it.deleted_at = dto.deleted_at;
    return it;
  }

  public static createModel(entity: UserModel) {
    return this.from({
      uid: entity.uid,
      email: entity.email,
      full_name: entity.full_name,
      password: entity.password,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    });
  }
}
