import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PackingService } from './packing.service';
import { PackOrdersDto } from './dto/pack-orders.dto';

@ApiTags('packing')
@Controller('pack-orders')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  pack(@Body() body: PackOrdersDto) {
    console.log('Dados recebidos no controller:', JSON.stringify(body, null, 2));
    return this.packingService.packOrders(body);
  }
}
