import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class DimensoesDto {
  @ApiProperty()
  @IsNumber()
  altura: number;
  
  @ApiProperty()
  @IsNumber()
  largura: number;
  
  @ApiProperty()
  @IsNumber()
  comprimento: number;
}

class ProdutoDto {
  @ApiProperty()
  @IsString()
  produto_id: string;
  
  @ApiProperty({ type: DimensoesDto })
  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes: DimensoesDto;
}

class PedidoDto {
  @ApiProperty()
  @IsNumber()
  pedido_id: number;
  
  @ApiProperty({ type: [ProdutoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos: ProdutoDto[];
}

export class PackOrdersDto {
  @ApiProperty({ type: [PedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  pedidos: PedidoDto[];
}
