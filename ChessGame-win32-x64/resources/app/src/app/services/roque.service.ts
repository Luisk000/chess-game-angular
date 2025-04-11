import { Injectable } from '@angular/core';
import { Rei } from '../models/pecas/rei.model';
import { Torre } from '../models/pecas/torre.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Posicao } from '../models/posicao.model';
import { Subject } from 'rxjs';
import { Peca } from '../models/peca.model';
import { getAnimationData } from '../move-animation.helper';

@Injectable({
  providedIn: 'root',
})
export class RoqueService {

  private verificarSegurancaRoqueSubject = new Subject<void>();
  verificarSegurancaRoqueObs = this.verificarSegurancaRoqueSubject.asObservable();

  private realizarRoqueSubject = new Subject<string>();
  realizarRoqueObs = this.realizarRoqueSubject.asObservable();

  constructor() {}

  verificarRoquePequeno(time: string, tabuleiro: Casa[][]): boolean {
    if (
      this.verificarRoqueRei(time, tabuleiro) &&
      this.verificarRoquePequenoTorre(time, tabuleiro) &&
      this.permitirRoquePequeno(time, tabuleiro)
    )
      return true;
    else return false;
  }

  verificarRoqueGrande(time: string, tabuleiro: Casa[][]): boolean {
    if (
      this.verificarRoqueRei(time, tabuleiro) &&
      this.verificarRoqueGrandeTorre(time, tabuleiro) &&
      this.permitirRoqueGrande(time, tabuleiro)
    )
      return true;
    else return false;
  }

  verificarPosicaoRoque(peca: Torre | Rei): string {
    let posicaoRoque = '';

    if (peca.cor == 'branco') {
      if (peca.roquePequeno == true && peca.roqueGrande == true)
        posicaoRoque = 'branco';
      else if (peca.roquePequeno == true) posicaoRoque = 'branco-right';
      else if (peca.roqueGrande == true) posicaoRoque = 'branco-left';
    } else {
      if (peca.roquePequeno == true && peca.roqueGrande == true)
        posicaoRoque = 'preto';
      else if (peca.roquePequeno == true) posicaoRoque = 'preto-right';
      else if (peca.roqueGrande == true) posicaoRoque = 'preto-left';
    }
    return posicaoRoque;
  }

  setPosicaoReiRoque(
    posicao: string,
    posicaoReiTimeBranco: Posicao | undefined,
    posicaoReiTimePreto: Posicao | undefined
  ) {
    switch (posicao) {
      case 'branco-right':
        posicaoReiTimeBranco = new Posicao(7, 6);
        break;
      case 'preto-right':
        posicaoReiTimePreto = new Posicao(0, 6);
        break;
      case 'branco-left':
        posicaoReiTimeBranco = new Posicao(7, 2);
        break;
      case 'preto-left':
        posicaoReiTimePreto = new Posicao(0, 2);
        break;
    }
  }

  realizarRoque(
    posicao: string,
    tabuleiro: Casa[][],
    pecaService: PecaService
  ): Casa[][] {
    if (posicao == 'branco-right') {
      tabuleiro[7][7].peca = undefined;
      tabuleiro[7][4].peca = undefined;
      tabuleiro[7][6].peca = new Rei('branco', pecaService);
      tabuleiro[7][5].peca = new Torre('branco', pecaService);

      this.realizarAnimacao(tabuleiro[7][6].peca!, tabuleiro[7][5].peca!, posicao)

    } else if (posicao == 'preto-right') {
      tabuleiro[0][7].peca = undefined;
      tabuleiro[0][4].peca = undefined;
      tabuleiro[0][6].peca = new Rei('preto', pecaService);
      tabuleiro[0][5].peca = new Torre('preto', pecaService);

      this.realizarAnimacao(tabuleiro[0][6].peca!, tabuleiro[0][5].peca!, posicao)
    }
    if (posicao == 'branco-left') {
      tabuleiro[7][0].peca = undefined;
      tabuleiro[7][4].peca = undefined;
      tabuleiro[7][2].peca = new Rei('branco', pecaService);
      tabuleiro[7][3].peca = new Torre('branco', pecaService);

      this.realizarAnimacao(tabuleiro[7][2].peca!, tabuleiro[7][3].peca!, posicao)
    } 
    else if (posicao == 'preto-left') {
      tabuleiro[0][0].peca = undefined;
      tabuleiro[0][4].peca = undefined;
      tabuleiro[0][2].peca = new Rei('preto', pecaService);
      tabuleiro[0][3].peca = new Torre('preto', pecaService);

      this.realizarAnimacao(tabuleiro[0][2].peca!, tabuleiro[0][3].peca!, posicao)
    }
    return tabuleiro;
  }

  private realizarAnimacao(rei: Peca, torre: Peca, posicao: string){
    rei.animationState = 'moved';
    torre.animationState = 'moved';
    this.realizarRoqueSubject.next(posicao)
  }

  private verificarRoqueRei(time: string, tabuleiro: Casa[][]): boolean {
    if (
      time === 'branco' &&
      tabuleiro[7][4].peca instanceof Rei &&
      tabuleiro[7][4].peca.iniciando == true
    )
      return true;
    else if (
      time === 'preto' &&
      tabuleiro[0][4].peca instanceof Rei &&
      tabuleiro[0][4].peca.iniciando == true
    )
      return true;
    else return false;
  }

  private verificarRoquePequenoTorre(
    time: string,
    tabuleiro: Casa[][]
  ): boolean {
    if (time === 'branco') {
      if (
        tabuleiro[7][7].peca instanceof Torre &&
        tabuleiro[7][7].peca.iniciando == true
      )
        return true;
    } else {
      if (
        tabuleiro[0][7].peca instanceof Torre &&
        tabuleiro[0][7].peca.iniciando == true
      )
        return true;
    }
    return false;
  }

  private verificarRoqueGrandeTorre(
    time: string,
    tabuleiro: Casa[][]
  ): boolean {
    if (time === 'branco') {
      if (
        tabuleiro[7][0].peca instanceof Torre &&
        tabuleiro[7][0].peca.iniciando == true
      ) {
        return true;
      }
    } else {
      if (
        tabuleiro[0][0].peca instanceof Torre &&
        tabuleiro[0][0].peca.iniciando == true
      )
        return true;
    }
    return false;
  }

  private permitirRoquePequeno(time: string, tabuleiro: Casa[][]): boolean {
    if (
      time === 'branco' &&
      tabuleiro[7][5].peca == undefined &&
      tabuleiro[7][6].peca == undefined
    )
      return true;
    else if (
      time === 'preto' &&
      tabuleiro[0][5].peca == undefined &&
      tabuleiro[0][6].peca == undefined
    )
      return true;
    else return false;
  }

  private permitirRoqueGrande(time: string, tabuleiro: Casa[][]) {
    if (
      time === 'branco' &&
      tabuleiro[7][1].peca == undefined &&
      tabuleiro[7][2].peca == undefined &&
      tabuleiro[7][3].peca == undefined
    )
      return true;
    else if (
      time === 'preto' &&
      tabuleiro[0][1].peca == undefined &&
      tabuleiro[0][2].peca == undefined &&
      tabuleiro[0][3].peca == undefined
    )
      return true;
    else return false;
  }

  getAnimationRoque(posicaoAtual: Posicao, animacaoRoquePosicao: string, tabuleiro: Casa[][]){
    let posicaoRei: Posicao;
    let novaPosicaoRei: Posicao;
    let posicaoTorre: Posicao;
    let novaPosicaoTorre: Posicao;

    if (animacaoRoquePosicao == "branco-left"){
      posicaoRei = new Posicao(7, 4);
      novaPosicaoRei = new Posicao(7, 2);
      posicaoTorre = new Posicao(7, 0);
      novaPosicaoTorre = new Posicao(7, 3);
    }
    else if (animacaoRoquePosicao == "branco-right"){
      posicaoRei = new Posicao(7, 4);
      novaPosicaoRei = new Posicao(7, 6);
      posicaoTorre = new Posicao(7, 7);
      novaPosicaoTorre = new Posicao(7, 5);
    }
    else if (animacaoRoquePosicao == "preto-left"){
      posicaoRei = new Posicao(0, 4);
      novaPosicaoRei = new Posicao(0, 2);
      posicaoTorre = new Posicao(0, 0);
      novaPosicaoTorre = new Posicao(0, 3);
    }
    else if (animacaoRoquePosicao == "preto-right"){
      posicaoRei = new Posicao(0, 4);
      novaPosicaoRei = new Posicao(0, 6);
      posicaoTorre = new Posicao(0, 7);
      novaPosicaoTorre = new Posicao(0, 5);
    }

    if (novaPosicaoRei!.coluna == posicaoAtual.coluna && novaPosicaoRei!.linha == posicaoAtual.linha)
    {   
      var rei = tabuleiro[novaPosicaoRei!.coluna][novaPosicaoRei!.linha].peca!
      return getAnimationData(rei, posicaoRei!, novaPosicaoRei!.coluna, novaPosicaoRei!.linha)
    }
    else if (novaPosicaoTorre!.coluna == posicaoAtual.coluna && novaPosicaoTorre!.linha == posicaoAtual.linha)
    {
      var torre = tabuleiro[novaPosicaoTorre!.coluna][novaPosicaoTorre!.linha].peca!
      return getAnimationData(torre, posicaoTorre!, novaPosicaoTorre!.coluna, novaPosicaoTorre!.linha)
    }
    else 
      return '';
  }
}
