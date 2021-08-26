import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/orm.config';
import { TicketStatusModel } from '../model/ticket.status.model';
import { UserModel } from '../model/user.model';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([TicketStatusModel, UserModel], 'default'),
  ],
  providers: [StatusService, UserService],
  controllers: [StatusController],
  exports: [StatusService],
})
export class StatusModule {}
