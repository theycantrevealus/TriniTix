import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Authorization } from '../decorators/auth.decorator';
import { TicketStatusResponseDto } from '../interfaces/dtos/ticket.status.response.dto';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly service: StatusService) {}

  @Get()
  @ApiCreatedResponse({
    type: TicketStatusResponseDto,
  })
  @ApiOperation({ summary: 'Get all ticket status' })
  @ApiResponse({
    status: 200,
    description: 'Ticket status request success',
  })
  @ApiResponse({
    status: 404,
    description: 'Ticket status is not found',
  })
  @UseGuards(JwtAuthGuard)
  @Authorization(true)
  @ApiBearerAuth('JWT')
  public async getAll() {
    return await this.service.get_all();
  }
}
