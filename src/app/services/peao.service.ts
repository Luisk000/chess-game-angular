import { Injectable } from '@angular/core';
import { Posicao } from '../models/posicao.model';
import { Casa } from '../models/casa.model';
import { Peca } from '../models/peca.model';
import { Peao } from '../models/pecas/peao.model';

@Injectable({
  providedIn: 'root'
})
export class PeaoService {

  constructor() { }

  verificarMovimentosPeaoMover(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][]): Posicao[] | []{
      let acoes: Posicao[] = [];
      for (let acaoPossivel of acoesPossiveis){
        if (acaoPossivel.coluna >= 0 && acaoPossivel.coluna <= 7 
          && acaoPossivel.linha >= 0 && acaoPossivel.linha <= 7){
            var acao = new Posicao(acaoPossivel.coluna, acaoPossivel.linha);
            var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
            if (corPeca == undefined)
              acoes.push(acao);
            else
              break;
        }
      }
      return acoes;
  }
  
  verificarMovimentosPeaoComer(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][], acaoEnPassant?: Posicao | undefined): Posicao[] | []{
      let acoes: Posicao[] = [];
      for (let acaoPossivel of acoesPossiveis){
        if (acaoPossivel.coluna >= 0 && acaoPossivel.coluna <= 7 
          && acaoPossivel.linha >= 0 && acaoPossivel.linha <= 7){

            var acao = new Posicao(acaoPossivel.coluna, acaoPossivel.linha);
            var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)

            if (corPeca != undefined && corPeca != cor)
              acoes.push(acao);    
            else if (acaoEnPassant){
              var enPassant = this.permitirEnPassant(acaoEnPassant, acao)
              if (enPassant)
                acoes.push(acaoEnPassant)
            }
           
        }
      }
      return acoes;
  }

  verificarMovimentosEnPassant(peca: Peao){
    for (let acao of peca.acoes){
      if (this.permitirEnPassant(peca.posicaoEnPassant!, acao))
        peca.acoes.push(peca.posicaoEnPassant!)  
    }
  }

  verificarPromocao(peao: Peao, coluna: number): boolean{
    if (
        (
          (peao.cor === 'branco' && coluna == 0) ||
          (peao.cor === 'preto' && coluna == 7)
        ) 
        && peao.promocao == false
    ) 
      peao.promocao = true;

    return peao.promocao; 
  }
  
  verificarEnPassant(peao: Peao, coluna: number, linha: number): Posicao | undefined {
    let posicaoEnPassant = undefined;
  
    if (peao.cor == 'branco' && coluna == 4)
      posicaoEnPassant = new Posicao(coluna + 1, linha);
    else if (peao.cor == 'preto' && coluna == 3)
      posicaoEnPassant = new Posicao(coluna - 1, linha);

    return posicaoEnPassant;
  }

  private verificarPecaNaCasa(acao: Posicao, tabuleiro: Casa[][]) {
      var peca: Peca | undefined = tabuleiro[acao.coluna][acao.linha].peca;
          if (peca && peca.cor)
            return peca.cor;
          else
            return undefined;
  }

  private permitirEnPassant(posicaoEnPassant: Posicao, acao: Posicao): boolean{
      if (posicaoEnPassant.coluna == acao.coluna && 
        posicaoEnPassant.linha == acao.linha)
        return true;
      else
        return false;
  }


}
