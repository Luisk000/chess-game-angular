import { Injectable } from '@angular/core';
import { Posicao } from '../models/posicao.model';
import { Casa } from '../models/casa.model';
import { Peca } from '../models/peca.model';

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
  
    verificarMovimentosPeaoComer(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][], posicaoEnPassant: Posicao | undefined): Posicao[] | []{
      let acoes: Posicao[] = [];
      for (let acaoPossivel of acoesPossiveis){
        if (acaoPossivel.coluna >= 0 && acaoPossivel.coluna <= 7 
          && acaoPossivel.linha >= 0 && acaoPossivel.linha <= 7){

            var acao = new Posicao(acaoPossivel.coluna, acaoPossivel.linha);
            var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
            if (corPeca != undefined && corPeca != cor)
              acoes.push(acao);   

            if (posicaoEnPassant && 
              posicaoEnPassant && 
              this.permitirEnPassant(posicaoEnPassant, acao)
            )
              acoes.push(posicaoEnPassant)  
        }

             
      }
      return acoes;
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
