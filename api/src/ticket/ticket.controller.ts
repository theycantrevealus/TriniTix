import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
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
import { TicketDto, TicketInputDTO } from '../interfaces/dtos/ticket.dto';
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
  //===============================================================================================MY TICKET
  @Get()
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @ApiOperation({ summary: 'Get ticket list by current authentication' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All my ticket',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async getAll(@Request() req) {
    return await this.service.get_all_mine(req.user.uid);
  }
  //===============================================================================================ADD TICKET
  @Post('add')
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @ApiOperation({ summary: 'Get user identified by uid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Ticket failed to added',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async ticket_add(@Body() data: TicketInputDTO, @Request() req) {
    const authUser = req.user;
    const newStatus = await this.status.get_search('New');
    const code = await this.service.generate_code();
    const progress = await this.service.add(
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
  //===============================================================================================UPDATE TICKET
  @Put('edit')
  @ApiCreatedResponse({
    type: TicketResponseDto,
  })
  @ApiOperation({ summary: 'Edit ticket with status new' })
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
  public async ticket_edit(@Body() data: TicketInputDTO, @Request() req) {
    const authUser = req.user;
    const newStatus = await this.status.get_search('New');
    const code = await this.service.generate_code();
    const progress = await this.service.add(
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
