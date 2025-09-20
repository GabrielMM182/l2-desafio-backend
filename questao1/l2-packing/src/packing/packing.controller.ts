import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PackingService } from './packing.service';
import { PackOrdersDto } from './dto/pack-orders.dto';

@ApiTags('packing')
@ApiBearerAuth()
@Controller('pack-orders')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'))
  pack(@Body() body: PackOrdersDto) {
    console.log('Dados recebidos no controller:', JSON.stringify(body, null, 2));
    return this.packingService.packOrders(body);
  }
}
