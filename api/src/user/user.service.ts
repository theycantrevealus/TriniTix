import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../model/user.model';
import { getConnection, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserDTO, UserLoginDTO } from '../interfaces/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  userCreateRequestDup,
  userCreateRequestFailed,
  userCreateRequestSuccess,
  userDeleteRequestFailed,
  userDeleteRequestSuccess,
  userLoginRequestFailed,
  userLoginRequestSuccess,
  userUpdateRequestFailed,
  userUpdateRequestSuccess,
} from '../interfaces/dtos/user.response.dto';
import env = require('dotenv');

env.config();
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: UserLoginDTO) {
    const findUser: UserDTO = await this.repo.findOne({ email: data.email });
    if (findUser) {
      const isMatch = await bcrypt.compare(data.password, findUser.password);
      if (isMatch) {
        try {
          const token = this.jwtService.sign(data, {
            expiresIn: 30 * 24 * 60 * 60,
          });
          userLoginRequestSuccess.user = UserDTO.from(findUser);
          userLoginRequestSuccess.token = token;
          return userLoginRequestSuccess;
        } catch (e) {
          return userLoginRequestFailed;
        }
      } else {
        return userLoginRequestFailed;
      }
    } else {
      return userLoginRequestFailed;
    }
  }

  async detail(uid: string) {
    return await this.repo.findOne({ withDeleted: true, where: { uid: uid } });
  }

  async get_all(): Promise<UserDTO[]> {
    return await this.repo.find({
      withDeleted: true,
    });
  }

  async get_active(): Promise<UserDTO[]> {
    return await this.repo.find({
      withDeleted: true,
      where: { deleted_at: null },
    });
  }

  async delete_soft(uid: string) {
    const result = await this.repo.softDelete({ uid: uid });
    if (result) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  async delete_hard(uid: string) {
    const result = await this.repo.delete({ uid: uid });
    if (result) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  async insert(userDTO: UserDTO) {
    const check = await this.check_dup(userDTO.email);
    if (!check) {
      const saltOrRounds = 10;
      const password = userDTO.password;
      userDTO.password = await bcrypt.hash(password, saltOrRounds);

      const result = await this.repo.save(UserDTO.createModel(userDTO));
      if (result) {
        return userCreateRequestSuccess;
      } else {
        return userCreateRequestFailed;
      }
    } else {
      return userCreateRequestDup;
    }
  }

  async update(userDTO: UserDTO) {
    const saltOrRounds = 10;
    const password = userDTO.password;
    userDTO.password = await bcrypt.hash(password, saltOrRounds);

    const result = await this.repo.save(UserDTO.createModel(userDTO));
    if (result) {
      const updateResult = await this.detail(userDTO.uid);
      userUpdateRequestSuccess.user = updateResult;
      return userUpdateRequestSuccess;
    } else {
      return userUpdateRequestFailed;
    }
  }

  async check_dup(email: string) {
    return await getConnection()
      .getRepository(UserModel)
      .createQueryBuilder('user')
      .where('deleted_at IS NULL')
      .orderBy('created_at', 'DESC')
      .andWhere('email = :email')
      .setParameters({ email: email })
      .getOne();
  }
}
