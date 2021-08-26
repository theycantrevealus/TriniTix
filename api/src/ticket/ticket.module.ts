import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/orm.config';
import { UserService } from '../user/user.service';
import { TicketModel } from '../model/ticket.model';
import { UserModel } from '../model/user.model';
import { StatusService } from '../status/status.service';
import { TicketStatusModel } from '../model/ticket.status.model';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature(
      [TicketStatusModel, TicketModel, UserModel],
      'default',
    ),
  ],
  providers: [StatusService, TicketService, UserService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
