import { Injectable } from '@nestjs/common';

type Dimensoes = { altura: number; largura: number; comprimento: number };
type Produto = { produto_id: string; dimensoes: Dimensoes };
type Pedido = { pedido_id: number; produtos: Produto[] };
type Caixa = { caixa_id: string; dimensoes: Dimensoes };

const CAIXAS: Caixa[] = [
  { caixa_id: 'Caixa 1', dimensoes: { altura: 30, largura: 40, comprimento: 80 } },
  { caixa_id: 'Caixa 2', dimensoes: { altura: 50, largura: 50, comprimento: 40 } },
  { caixa_id: 'Caixa 3', dimensoes: { altura: 50, largura: 80, comprimento: 60 } },
];

@Injectable()
export class PackingService {
  packOrders(data: { pedidos: Pedido[] }) {    
    if (!data || !data.pedidos || !Array.isArray(data.pedidos)) {
      return { pedidos: [] };
    }
    
    return {
      pedidos: data.pedidos.map((pedido) => {
        return this.processPedido(pedido);
      }),
    };
  }

  private processPedido(pedido: Pedido) {
    if (!pedido) {
      return { pedido_id: null, caixas: [] };
    }
    
    if (!pedido.produtos || !Array.isArray(pedido.produtos)) {
      return { pedido_id: pedido.pedido_id || null, caixas: [] };
    }    
    const melhorEmpacotamento = this.encontrarMelhorEmpacotamento(pedido.produtos);
    
    const resultado = { pedido_id: pedido.pedido_id, caixas: melhorEmpacotamento };    
    return resultado;
  }
  
  private encontrarMelhorEmpacotamento(produtos: Produto[]): any[] {
    const caixas: any[] = [];
    const produtosNaoProcessados = [...produtos];
    
    produtosNaoProcessados.sort((a, b) => {
      const volumeA = a.dimensoes.altura * a.dimensoes.largura * a.dimensoes.comprimento;
      const volumeB = b.dimensoes.altura * b.dimensoes.largura * b.dimensoes.comprimento;
      return volumeB - volumeA;
    });

    for (const produto of produtosNaoProcessados) {
      
      let foiAlocado = false;
      
      const caixasOrdenadas = [...caixas].sort((a, b) => {
        const caixaA = this.getCaixaPorId(a.caixa_id);
        const caixaB = this.getCaixaPorId(b.caixa_id);
        if (!caixaA || !caixaB) return 0;
        const volumeA = caixaA.dimensoes.altura * caixaA.dimensoes.largura * caixaA.dimensoes.comprimento;
        const volumeB = caixaB.dimensoes.altura * caixaB.dimensoes.largura * caixaB.dimensoes.comprimento;
        return volumeA - volumeB;
      });
      
      for (const caixa of caixasOrdenadas) {
        if (caixa.caixa_id && this.produtosCabemJuntosNaCaixa([...caixa.produtos, produto.produto_id], produtos, this.getCaixaPorId(caixa.caixa_id)!)) {
          caixa.produtos.push(produto.produto_id);
          foiAlocado = true;
          break;
        }
      }
      
      if (!foiAlocado) {
        const melhorCaixa = this.findBestCaixa(produto);
        
        if (melhorCaixa) {
          caixas.push({ 
            caixa_id: melhorCaixa.caixa_id, 
            produtos: [produto.produto_id] 
          });
        } else {
          caixas.push({
            caixa_id: null,
            produtos: [produto.produto_id],
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          });
        }
      }
    }
    
    return caixas;
  }
  
  private getCaixaPorId(caixaId: string): Caixa | null {
    return CAIXAS.find(c => c.caixa_id === caixaId) || null;
  }

  private findBestCaixa(produto: Produto): Caixa | null {
    
    const caixasViaveis = CAIXAS.filter(caixa => {
      const cabe = this.produtoCabeNaCaixa(produto, caixa);
      return cabe;
    });
    
    if (caixasViaveis.length === 0) {
      return null;
    }
    
    const volumeProduto = produto.dimensoes.altura * produto.dimensoes.largura * produto.dimensoes.comprimento;
    
    const caixaComEficiencia = caixasViaveis.map(caixa => {
      const volumeCaixa = caixa.dimensoes.altura * caixa.dimensoes.largura * caixa.dimensoes.comprimento;
      const eficiencia = volumeProduto / volumeCaixa;
      return { caixa, eficiencia, volumeCaixa };
    });
    
    caixaComEficiencia.sort((a, b) => {
      const diferencaEficiencia = b.eficiencia - a.eficiencia;
      if (Math.abs(diferencaEficiencia) > 0.1) {
        return diferencaEficiencia;
      }
      return a.volumeCaixa - b.volumeCaixa;
    });
    
    const melhorCaixa = caixaComEficiencia[0].caixa;
    
    return melhorCaixa;
  }

  private produtoCabeNaCaixa(produto: Produto, caixa: Caixa): boolean {
    const { altura, largura, comprimento } = produto.dimensoes;
    const { altura: altCaixa, largura: largCaixa, comprimento: compCaixa } = caixa.dimensoes;    
    const orientacoes = [
      [altura, largura, comprimento],
      [altura, comprimento, largura],
      [largura, altura, comprimento],
      [largura, comprimento, altura],
      [comprimento, altura, largura],
      [comprimento, largura, altura]
    ];

    for (const [h, w, d] of orientacoes) {
      const cabe = h <= altCaixa && w <= largCaixa && d <= compCaixa;
      if (cabe) {
        return true;
      }
    }
    
    return false;
  }

  private produtosCabemJuntosNaCaixa(produtoIds: string[], todosProdutos: Produto[], caixa: Caixa): boolean {
    const produtos = todosProdutos.filter(p => produtoIds.includes(p.produto_id));
    
    for (const produto of produtos) {
      if (!this.produtoCabeNaCaixa(produto, caixa)) {
        return false;
      }
    }
    
    const volumes = produtos.map(p => p.dimensoes.altura * p.dimensoes.largura * p.dimensoes.comprimento);
    const volumeMaximo = Math.max(...volumes);
    const volumeMinimo = Math.min(...volumes);
    
    if (produtos.length > 1 && volumeMaximo / volumeMinimo > 10) {
      return false;
    }
    
    const volumeTotal = volumes.reduce((total, vol) => total + vol, 0);
    const volumeCaixa = caixa.dimensoes.altura * caixa.dimensoes.largura * caixa.dimensoes.comprimento;
    
    const fatorUtilizacao = caixa.caixa_id === 'Caixa 3' ? 0.5 : 0.7;
    const cabePorVolume = volumeTotal <= volumeCaixa * fatorUtilizacao;    
    return cabePorVolume;
  }
}
