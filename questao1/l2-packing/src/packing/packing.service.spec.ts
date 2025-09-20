import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from './packing.service';

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('packOrders', () => {
    it('deve retornar objeto vazio quando dados de entrada são inválidos', () => {
      const resultado = service.packOrders({ pedidos: null as any });
      expect(resultado).toEqual({ pedidos: [] });
    });

    it('deve retornar array vazio quando não há pedidos', () => {
      const resultado = service.packOrders({ pedidos: [] });
      expect(resultado).toEqual({ pedidos: [] });
    });

    it('deve processar pedido simples com um produto pequeno', () => {
      const entrada = {
        pedidos: [{
          pedido_id: 1,
          produtos: [{
            produto_id: 'Produto1',
            dimensoes: { altura: 10, largura: 10, comprimento: 10 }
          }]
        }]
      };

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos).toHaveLength(1);
      expect(resultado.pedidos[0].pedido_id).toBe(1);
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
      expect(resultado.pedidos[0].caixas[0].produtos).toContain('Produto1');
    });

    it('deve usar Caixa 2 para produtos que não cabem na Caixa 1', () => {
      const entrada = {
        pedidos: [{
          pedido_id: 1,
          produtos: [
            { produto_id: 'PS5', dimensoes: { altura: 40, largura: 10, comprimento: 25 } },
            { produto_id: 'Volante', dimensoes: { altura: 40, largura: 30, comprimento: 30 } }
          ]
        }]
      };

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBe('Caixa 2');
      expect(resultado.pedidos[0].caixas[0].produtos).toContain('PS5');
      expect(resultado.pedidos[0].caixas[0].produtos).toContain('Volante');
    });

    it('deve separar produtos com grande diferença de tamanho', () => {
      const entrada = {
        pedidos: [{
          pedido_id: 6,
          produtos: [
            { produto_id: 'Monitor', dimensoes: { altura: 50, largura: 60, comprimento: 20 } },
            { produto_id: 'Webcam', dimensoes: { altura: 7, largura: 10, comprimento: 5 } },
            { produto_id: 'Microfone', dimensoes: { altura: 25, largura: 10, comprimento: 10 } },
            { produto_id: 'Notebook', dimensoes: { altura: 2, largura: 35, comprimento: 25 } }
          ]
        }]
      };

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos[0].caixas.length).toBeGreaterThan(1);
      
      const caixaComMonitor = resultado.pedidos[0].caixas.find(c => c.produtos.includes('Monitor'));
      expect(caixaComMonitor.caixa_id).toBe('Caixa 3');
      
      const outrasCaixas = resultado.pedidos[0].caixas.filter(c => !c.produtos.includes('Monitor'));
      expect(outrasCaixas.length).toBeGreaterThan(0);
    });

    it('deve retornar caixa_id null para produtos que não cabem em nenhuma caixa', () => {
      const entrada = {
        pedidos: [{
          pedido_id: 5,
          produtos: [{
            produto_id: 'Cadeira Gamer',
            dimensoes: { altura: 120, largura: 60, comprimento: 70 }
          }]
        }]
      };

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBeNull();
      expect(resultado.pedidos[0].caixas[0].observacao).toContain('não cabe em nenhuma caixa');
    });
  });

  describe('regras de negócio específicas', () => {
    it('deve combinar produtos pequenos na mesma caixa', () => {
      const entrada = {
        pedidos: [{
          pedido_id: 2,
          produtos: [
            { produto_id: 'Joystick', dimensoes: { altura: 15, largura: 20, comprimento: 10 } },
            { produto_id: 'Fifa 24', dimensoes: { altura: 10, largura: 30, comprimento: 10 } },
            { produto_id: 'Call of Duty', dimensoes: { altura: 30, largura: 15, comprimento: 10 } }
          ]
        }]
      };

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos[0].caixas).toHaveLength(1);
      expect(resultado.pedidos[0].caixas[0].caixa_id).toBe('Caixa 1');
      expect(resultado.pedidos[0].caixas[0].produtos).toHaveLength(3);
    });

    it('deve processar múltiplos pedidos independentemente', () => {
      const entrada = {
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

      const resultado = service.packOrders(entrada);
      
      expect(resultado.pedidos).toHaveLength(2);
      expect(resultado.pedidos[0].pedido_id).toBe(1);
      expect(resultado.pedidos[1].pedido_id).toBe(2);
      expect(resultado.pedidos[0].caixas[0].produtos).toContain('Produto1');
      expect(resultado.pedidos[1].caixas[0].produtos).toContain('Produto2');
    });
  });
});
