import { Injectable } from '@angular/core';
import { Acao } from '../models/acao.model';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor() { }

  verificarMovimentos(acoesPossiveis: Acao[]): Acao[] | []{
    let acoes = [];
    for (let acao of acoesPossiveis){
      if (acao.colunaPossivel >= 0 && acao.colunaPossivel <= 7 && 
        acao.linhaPossivel >= 0 && acao.linhaPossivel <= 7
      )
        acoes.push(this.addMovimento(acao.colunaPossivel, acao.linhaPossivel));
    }
    return acoes;
  }

verificarMovimentosDiagonal(colunaInicio: number, linhaInicio: number): Acao[] | []{
    let acoes = [];
    let coluna = colunaInicio - 1;
    let linha = linhaInicio - 1;
    while (coluna >= 0 && linha >= 0){
      acoes.push(this.addMovimento(coluna, linha));
        coluna--;
        linha--;
    }

    coluna = colunaInicio - 1;
    linha = linhaInicio + 1;
    while (coluna >= 0 && linha <= 7){
        acoes.push(this.addMovimento(coluna, linha));
        coluna--;
        linha++;
    }

    coluna = colunaInicio + 1;
    linha = linhaInicio - 1;
    while (coluna <= 7 && linha >= 0){
      acoes.push(this.addMovimento(coluna, linha));
        coluna++;
        linha--;
    }

    coluna = colunaInicio + 1;
    linha = linhaInicio + 1;
    while (coluna <= 7 && linha <= 7){
      acoes.push(this.addMovimento(coluna, linha));
        coluna++;
        linha++;
    }

    return acoes;
}

verificarMovimentosReto(colunaInicio: number, linhaInicio: number): Acao[] | [] {
    let acoes = [];
    let coluna = colunaInicio - 1;
    while (coluna >= 0){
      acoes.push(this.addMovimento(coluna, linhaInicio));
        coluna--;
    }

    coluna = colunaInicio + 1;
    while (coluna <= 7){
      acoes.push(this.addMovimento(coluna, linhaInicio));
        coluna++;
    }

    let linha = linhaInicio - 1;
    while (linha >= 0){
      acoes.push(this.addMovimento(colunaInicio, linha));
        linha--;
    }

    linha = linhaInicio + 1;
    while (linha <= 7){
      acoes.push(this.addMovimento(colunaInicio, linha));
        linha++;
    }
    return acoes;
}

private addMovimento(colunaPossivel: number, linhaPossivel: number): Acao {
  let acao = { 
      colunaPossivel: colunaPossivel, 
      linhaPossivel: linhaPossivel
  };
  return acao;
};
}
