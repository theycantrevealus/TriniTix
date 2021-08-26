import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../model/user.model';
import { getConnection, Repository } from 'typeorm';
import { LoginUserDto } from '../interfaces/dtos/user.login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponseDto } from '../interfaces/dtos/user.login.response.dto';
import { UserDTO } from '../interfaces/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import env = require('dotenv');
env.config();
import {
  userDeleteRequestFailed,
  userDeleteRequestSuccess,
} from '../interfaces/dtos/user.delete.response.dto';
import {
  userCreateRequestDup,
  userCreateRequestFailed,
  userCreateRequestSuccess,
} from '../interfaces/dtos/user.add.response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginUserDto) {
    const find_user = await this.repo.findOne({ email: data.email });
    let response: LoginUserResponseDto = {
      status: HttpStatus.FORBIDDEN,
      message: 'user not found',
      errors: null,
      data: null,
    };
    if (find_user) {
      const isMatch = await bcrypt.compare(data.password, find_user.password);
      if (isMatch) {
        try {
          const token = this.jwtService.sign(data, {
            expiresIn: 30 * 24 * 60 * 60,
          });

          response = {
            status: HttpStatus.OK,
            message: 'login_success',
            errors: null,
            data: {
              user: find_user,
              token: token,
            },
          };
        } catch (e) {
          response = {
            status: HttpStatus.FORBIDDEN,
            message: 'login failed',
            errors: ['login failed'],
            data: {
              user: null,
              token: null,
            },
          };
        }
      } else {
        response = {
          status: HttpStatus.FORBIDDEN,
          message: 'login failed',
          errors: ['login failed'],
          data: {
            user: null,
            token: null,
          },
        };
      }
    } else {
      response = {
        status: HttpStatus.FORBIDDEN,
        message: 'login failed',
        errors: ['login failed'],
        data: {
          user: null,
          token: null,
        },
      };
    }

    return response;
  }

  async get_detail(uid: string) {
    return await this.repo.findOne(uid);
  }

  async user_all(): Promise<UserDTO[]> {
    return await this.repo.find({ deleted_at: null });
  }

  async user_all_active(): Promise<UserDTO[]> {
    return await this.repo.find({ deleted_at: null });
  }

  async user_delete_soft(uid: string) {
    const deleteResult = await this.repo.softDelete({ uid: uid });
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  async user_delete_hard(uid: string) {
    const deleteResult = await this.repo.delete({ uid: uid });
    if (deleteResult) {
      return userDeleteRequestSuccess;
    } else {
      return userDeleteRequestFailed;
    }
  }

  async user_add(userDTO: UserDTO) {
    const check = await this.user_duplicate_check(userDTO.email);
    if (!check) {
      const saltOrRounds = 10;
      const password = userDTO.password;
      userDTO.password = await bcrypt.hash(password, saltOrRounds);
      userDTO.uid = uuid();

      const createdResult = await this.repo.save(UserDTO.createModel(userDTO));
      if (createdResult) {
        return userCreateRequestSuccess;
      } else {
        return userCreateRequestFailed;
      }
    } else {
      return userCreateRequestDup;
    }
  }

  async user_duplicate_check(email: string) {
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
