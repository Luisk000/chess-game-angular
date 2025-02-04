import { Injectable } from '@angular/core';
import { Posicao } from '../models/posicao.model';
import { Casa } from '../models/casa.model';
import { Peca } from '../models/peca.model';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor() { }

  verificarMovimentos(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][]): Posicao[] | []{
    let acoes: Posicao[] = [];
    for (let acao of acoesPossiveis){
      if (acao.coluna >= 0 && acao.coluna <= 7 && acao.linha >= 0 && acao.linha <= 7){
        //
        var peca: Peca | undefined = tabuleiro[acao.coluna][acao.linha].peca;
        if (peca != undefined){
          if (peca.cor && peca.cor != cor)
            acoes.push(new Posicao(acao.coluna, acao.linha));
          //break;
        }     
        else
          acoes.push(new Posicao(acao.coluna, acao.linha));
        //
    }
  }
    return acoes;
  }

  verificarMovimentosDiagonal(posicao: Posicao, cor: string, tabuleiro: Casa[][]): Posicao[] | []{
    let acoes: Posicao[] = [];
    let coluna = posicao.coluna - 1;
    let linha = posicao.linha - 1;
    while (coluna >= 0 && linha >= 0){
      acoes.push(new Posicao(coluna, linha));
      coluna--;
      linha--;
    }

    coluna = posicao.coluna - 1;
    linha = posicao.linha + 1;
    while (coluna >= 0 && linha <= 7){
        acoes.push(new Posicao(coluna, linha));
        coluna--;
        linha++;
    }

    coluna = posicao.coluna + 1;
    linha = posicao.linha - 1;
    while (coluna <= 7 && linha >= 0){
      acoes.push(new Posicao(coluna, linha));
        coluna++;
        linha--;
    }

    coluna = posicao.coluna + 1;
    linha = posicao.linha + 1;
    while (coluna <= 7 && linha <= 7){
      acoes.push(new Posicao(coluna, linha));
        coluna++;
        linha++;
    }

    return acoes;
}

verificarMovimentosReto(posicao: Posicao, core: string, tabuleiro: Casa[][]): Posicao[] | [] {
    let acoes: Posicao[] = [];
    let coluna = posicao.coluna - 1;
    while (coluna >= 0){
      acoes.push(new Posicao(coluna, posicao.linha));
      coluna--;
    }

    coluna = posicao.coluna + 1;
    while (coluna <= 7){
      acoes.push(new Posicao(coluna, posicao.linha));
      coluna++;
    }

    let linha = posicao.linha - 1;
    while (linha >= 0){
      acoes.push(new Posicao(posicao.coluna, linha));
      linha--;
    }

    linha = posicao.linha + 1;
    while (linha <= 7){
      acoes.push(new Posicao(posicao.coluna, linha));
      linha++;
    }
    return acoes;
  }

  verificarPecaNaCasa(){

  }
}
