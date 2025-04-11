import { Injectable } from '@angular/core';
import { Posicao } from '../models/posicao.model';
import { Casa } from '../models/casa.model';
import { Peca } from '../models/peca.model';
import { Peao } from '../models/pecas/peao.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeaoService {

  posicaoEnPassant: Posicao | undefined;
  timeEnPassant: string = "";

  private promocaoSubject = new Subject<Posicao>();
  private enPassantSubject = new Subject<Peca>();

  promocaoObs = this.promocaoSubject.asObservable();
  enPassantObs = this.enPassantSubject.asObservable();

  constructor() { }

    verificarAcoesEspeciaisPeaoFinal(peca: Peca, coluna: number, linha: number, tabuleiro: Casa[][]) {
      if (peca instanceof Peao) {
        if (peca.iniciando == true) {
          this.posicaoEnPassant = this.getPosicaoEnPassant(
            peca,
            coluna,
            linha
          );
          this.timeEnPassant = peca.cor;
          peca.iniciando = false;
        }

        let pecaCapturadaEnPassant = this.verificarEnPassant(peca.cor, coluna, linha, tabuleiro);
        if (pecaCapturadaEnPassant)
          this.enPassantSubject.next(pecaCapturadaEnPassant)

        if (this.verificarPromocao(peca, coluna))
          this.promocaoSubject.next(new Posicao(coluna, linha));
      }
    }
  
    confirmarPecaPeaoPromovido($event: Peca, posicaoPromocao: Posicao | undefined, tabuleiro: Casa[][]) {
        let col = posicaoPromocao!.coluna;
        let ca = posicaoPromocao!.linha;
        tabuleiro[col][ca].peca = $event;
    }
  
    verificarEnPassantInicio(peca: Peao) {
      if (this.timeEnPassant != peca.cor && 
        !peca.posicaoEnPassant
      )
        peca.posicaoEnPassant = this.posicaoEnPassant;
      else
        peca.posicaoEnPassant = undefined;   
    }
  
    verificarEnPassant(cor: string, coluna: number, linha: number, tabuleiro: Casa[][]): Peca | undefined {
      let pecaCapturada: Peca | undefined = undefined;
      
      if (
        this.posicaoEnPassant &&
        coluna == this.posicaoEnPassant.coluna &&
        linha == this.posicaoEnPassant.linha
      ) {
        if (cor == 'branco') {
          pecaCapturada = tabuleiro[coluna + 1][linha].peca;
          tabuleiro[coluna + 1][linha].peca = undefined;
        } else {
          pecaCapturada = tabuleiro[coluna - 1][linha].peca;
          tabuleiro[coluna - 1][linha].peca = undefined;
        }
      }
      return pecaCapturada;
    }

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
  
  verificarMovimentosPeaoCapturar(acoesPossiveis: Posicao[], cor: string, tabuleiro: Casa[][], acaoEnPassant?: Posicao | undefined): Posicao[] | []{
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
  
  getPosicaoEnPassant(peao: Peao, coluna: number, linha: number): Posicao | undefined {
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
