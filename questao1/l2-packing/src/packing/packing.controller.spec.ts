import { Test, TestingModule } from '@nestjs/testing';
import { PackingController } from './packing.controller';
import { PackingService } from './packing.service';
import { PackOrdersDto } from './dto/pack-orders.dto';

describe('PackingController', () => {
  let controller: PackingController;
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackingController],
      providers: [PackingService],
    }).compile();

    controller = module.get<PackingController>(PackingController);
    service = module.get<PackingService>(PackingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('pack', () => {
    it('deve chamar o packingService.packOrders com os dados corretos', () => {
      const mockData: PackOrdersDto = {
        pedidos: [{
          pedido_id: 1,
          produtos: [{
            produto_id: 'Teste',
            dimensoes: { altura: 10, largura: 10, comprimento: 10 }
          }]
        }]
      };

      const mockResult = {
        pedidos: [{
          pedido_id: 1,
          caixas: [{
            caixa_id: 'Caixa 1',
            produtos: ['Teste']
          }]
        }]
      };

      jest.spyOn(service, 'packOrders').mockReturnValue(mockResult);

      const result = controller.pack(mockData);

      expect(service.packOrders).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockResult);
    });

    it('deve processar pedido com produto que usa Caixa 2', () => {
      const mockData: PackOrdersDto = {
        pedidos: [{
          pedido_id: 1,
          produtos: [
            { produto_id: 'PS5', dimensoes: { altura: 40, largura: 10, comprimento: 25 } },
            { produto_id: 'Volante', dimensoes: { altura: 40, largura: 30, comprimento: 30 } }
          ]
        }]
      };

      const result = controller.pack(mockData);

      expect(result.pedidos).toHaveLength(1);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBe('Caixa 2');
      expect(result.pedidos[0].caixas[0].produtos).toEqual(
        expect.arrayContaining(['PS5', 'Volante'])
      );
    });

    it('deve processar pedido com múltiplos produtos pequenos na Caixa 1', () => {
      const mockData: PackOrdersDto = {
        pedidos: [{
          pedido_id: 2,
          produtos: [
            { produto_id: 'Joystick', dimensoes: { altura: 15, largura: 20, comprimento: 10 } },
            { produto_id: 'Fifa 24', dimensoes: { altura: 10, largura: 30, comprimento: 10 } },
            { produto_id: 'Call of Duty', dimensoes: { altura: 30, largura: 15, comprimento: 10 } }
          ]
        }]
      };

      const result = controller.pack(mockData);

      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
      expect(result.pedidos[0].caixas[0].produtos).toHaveLength(3);
    });

    it('deve retornar caixa_id null para produtos que não cabem', () => {
      const mockData: PackOrdersDto = {
        pedidos: [{
          pedido_id: 5,
          produtos: [{
            produto_id: 'Cadeira Gamer',
            dimensoes: { altura: 120, largura: 60, comprimento: 70 }
          }]
        }]
      };

      const result = controller.pack(mockData);

      expect(result.pedidos[0].caixas).toHaveLength(1);
      expect(result.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(result.pedidos[0].caixas[0].observacao).toBeDefined();
    });

    it('deve processar múltiplos pedidos', () => {
      const mockData: PackOrdersDto = {
        pedidos: [
          {
            pedido_id: 1,
            produtos: [{ produto_id: 'Produto1', dimensoes: { altura: 10, largura: 10, comprimento: 10 } }]
          },
          {
            pedido_id: 2,
            produtos: [{ produto_id: 'Produto2', dimensoes: { altura: 15, largura: 15, comprimento: 15 } }]
          }
        ]
      };

      const result = controller.pack(mockData);

      expect(result.pedidos).toHaveLength(2);
      expect(result.pedidos[0].pedido_id).toBe(1);
      expect(result.pedidos[1].pedido_id).toBe(2);
    });

    it('deve tratar dados de entrada inválidos', () => {
      const mockData: PackOrdersDto = {
        pedidos: null as any
      };

      const result = controller.pack(mockData);

      expect(result.pedidos).toEqual([]);
    });
  });
});
