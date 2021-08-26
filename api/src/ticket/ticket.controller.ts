import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Authorization } from '../decorators/auth.decorator';
import {
  ticketCreateRequestFailed,
  ticketCreateRequestSuccess,
  TicketResponseDto,
} from '../interfaces/dtos/ticket.response.dto';
import { TicketDto } from '../interfaces/dtos/ticket.dto';
import { UserService } from '../user/user.service';
import { StatusService } from '../status/status.service';

@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(
    private readonly service: TicketService,
    private readonly status: StatusService,
    private readonly user: UserService,
  ) {}

  @Get()
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @ApiOperation({ summary: 'Get user identified by uid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async getAll() {
    //return await this.service.get_all();
  }

  @Post('add')
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @ApiOperation({ summary: 'Get user identified by uid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async ticket_add(@Request() req, @Body() data: TicketDto) {
    const authUser = req.user;
    const newStatus = await this.status.get_search('New');
    const code = await this.service.generate_ticket_code();
    const progress = await this.service.ticket_add(
      TicketDto.from({
        code: code,
        title: data.title,
        content: data.content,
        creator: authUser.uid,
        status: newStatus[0].uid,
      }),
    );
    if (progress) {
      return ticketCreateRequestSuccess;
    } else {
      return ticketCreateRequestFailed;
    }
  }
}
