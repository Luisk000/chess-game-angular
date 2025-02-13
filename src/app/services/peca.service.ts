import { Injectable } from '@angular/core';
import { Posicao } from '../models/posicao.model';
import { Casa } from '../models/casa.model';
import { Peca } from '../models/peca.model';
import { PeaoService } from './peao.service';
import { RoqueService } from './roque.service';
import { XequeService } from './xeque.service';

@Injectable({
  providedIn: 'root'
})
export class PecaService {

  constructor(
    private peaoService: PeaoService, 
    private roqueService: RoqueService, 
    private xequeService: XequeService
  ) { }

  verificarMovimentos(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][]): Posicao[] | []{
    let acoes: Posicao[] = [];
    for (let acaoPossivel of acoesPossiveis){
      if (acaoPossivel.coluna >= 0 && acaoPossivel.coluna <= 7 
        && acaoPossivel.linha >= 0 && acaoPossivel.linha <= 7){
          var acao = new Posicao(acaoPossivel.coluna, acaoPossivel.linha);
          var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
          if (corPeca != undefined){
            if (corPeca != cor)
              acoes.push(acao);
          }     
          else
            acoes.push(acao);
      }
    }
    return acoes;
  }

  verificarMovimentosDiagonal(posicao: Posicao, cor: string, tabuleiro: Casa[][]): Posicao[] | []{
    let acoes: Posicao[] = [];
    let coluna = posicao.coluna - 1;
    let linha = posicao.linha - 1;
    while (coluna >= 0 && linha >= 0){
      var acao = new Posicao(coluna, linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
      coluna--;
      linha--;
    }

    coluna = posicao.coluna - 1;
    linha = posicao.linha + 1;
    while (coluna >= 0 && linha <= 7){
      var acao = new Posicao(coluna, linha);
      var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
      if (corPeca != undefined){
        if (corPeca != cor)
          acoes.push(acao);
        break;
      }     
      else
        acoes.push(acao);
      coluna--;
      linha++;
    }

    coluna = posicao.coluna + 1;
    linha = posicao.linha - 1;
    while (coluna <= 7 && linha >= 0){
      var acao = new Posicao(coluna, linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
        coluna++;
        linha--;
    }

    coluna = posicao.coluna + 1;
    linha = posicao.linha + 1;
    while (coluna <= 7 && linha <= 7){
      var acao = new Posicao(coluna, linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
        coluna++;
        linha++;
    }

    return acoes;
}

verificarMovimentosReto(posicao: Posicao, cor: string, tabuleiro: Casa[][]): Posicao[] | [] {
    let acoes: Posicao[] = [];
    let coluna = posicao.coluna - 1;
    while (coluna >= 0){
      var acao = new Posicao(coluna, posicao.linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
      coluna--;
    }

    coluna = posicao.coluna + 1;
    while (coluna <= 7){
      var acao = new Posicao(coluna, posicao.linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
      coluna++;
    }

    let linha = posicao.linha - 1;
    while (linha >= 0){
      var acao = new Posicao(posicao.coluna, linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
      linha--;
    }

    linha = posicao.linha + 1;
    while (linha <= 7){
      var acao = new Posicao(posicao.coluna, linha);
        var corPeca = this.verificarPecaNaCasa(acao, tabuleiro)
        if (corPeca != undefined){
          if (corPeca != cor)
            acoes.push(acao);
          break;
        }     
        else
          acoes.push(acao);
      linha++;
    }
    return acoes;
  }

  private verificarPecaNaCasa(acao: Posicao, tabuleiro: Casa[][]): string | undefined{
    var peca: Peca | undefined = tabuleiro[acao.coluna][acao.linha].peca;
    if (peca && peca.cor)
      return peca.cor;
    else
      return undefined;
  }

  verificarMovimentosPeaoMover(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][]): Posicao[] | []{
    return this.peaoService.verificarMovimentosPeaoMover(acoesPossiveis, cor, tabuleiro);
  }

  verificarMovimentosPeaoComer(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][], posicaoEnPassant: Posicao | undefined): Posicao[] | []{
    return this.peaoService.verificarMovimentosPeaoComer(acoesPossiveis, cor, tabuleiro, posicaoEnPassant);
  }

  verificarRoquePequeno(time: string, tabuleiro: Casa[][]): boolean{
    return this.roqueService.verificarRoquePequeno(time, tabuleiro);
  }

  verificarRoqueGrande(time: string, tabuleiro: Casa[][]): boolean{
    return this.roqueService.verificarRoqueGrande(time, tabuleiro);
  }
}
