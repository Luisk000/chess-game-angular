import { Injectable } from '@angular/core';
import { RoqueService } from './roque.service';
import { XequeService } from './xeque.service';
import { Peca } from '../models/peca.model';
import { Torre } from '../models/pecas/torre.model';
import { Rei } from '../models/pecas/rei.model';
import { Casa } from '../models/casa.model';
import { Posicao } from '../models/posicao.model';
import { PecaService } from './peca.service';
import * as flatted from 'flatted';

@Injectable({
  providedIn: 'root',
})
export class XequeRoqueService {
  constructor(
    private roqueService: RoqueService,
    private xequeService: XequeService,
    private pecaService: PecaService
  ) {}

  verificarRoqueInicio(peca: Peca, tabuleiro: Casa[][]): string {
    if (
      (peca instanceof Torre || peca instanceof Rei) &&
      this.xequeService.casaXeque == undefined
    ) {
      let posicaoRoque = this.roqueService.verificarPosicaoRoque(peca);
      if (posicaoRoque != '') {
        if (posicaoRoque === 'preto' || posicaoRoque === 'branco')
          return this.verificarSegurancaAposRoqueDuplo(
            peca.cor,
            posicaoRoque,
            tabuleiro
          );
        else if (
          this.verificarSegurancaAposRoque(peca.cor, posicaoRoque, tabuleiro) ==
          true
        )
          return posicaoRoque;
      }
    }
    return '';
  }

  private verificarSegurancaAposRoque(
    cor: string,
    posicaoRoque: string,
    tabuleiro: Casa[][]
  ) {
    var tabuleiroHipotetico: Casa[][] = flatted.parse(
      flatted.stringify(tabuleiro)
    );
    this.xequeService.retrieveInstances(tabuleiroHipotetico);
    var posicaoRei: Posicao;

    if (posicaoRoque === 'branco-right') {
      tabuleiroHipotetico[7][4].peca = undefined;
      tabuleiroHipotetico[7][7].peca = undefined;

      tabuleiroHipotetico[7][6].peca = new Rei(cor, this.pecaService);
      tabuleiroHipotetico[7][5].peca = new Torre(cor, this.pecaService);

      posicaoRei = new Posicao(7, 6);
    } else if (posicaoRoque === 'branco-left') {
      tabuleiroHipotetico[7][4].peca = undefined;
      tabuleiroHipotetico[7][0].peca = undefined;

      tabuleiroHipotetico[7][2].peca = new Rei(cor, this.pecaService);
      tabuleiroHipotetico[7][3].peca = new Torre(cor, this.pecaService);

      posicaoRei = new Posicao(7, 2);
    } else if (posicaoRoque === 'preto-right') {
      tabuleiroHipotetico[0][4].peca = undefined;
      tabuleiroHipotetico[0][7].peca = undefined;

      tabuleiroHipotetico[0][6].peca = new Rei(cor, this.pecaService);
      tabuleiroHipotetico[0][5].peca = new Torre(cor, this.pecaService);

      posicaoRei = new Posicao(0, 6);
    } else if (posicaoRoque === 'preto-left') {
      tabuleiroHipotetico[0][4].peca = undefined;
      tabuleiroHipotetico[0][0].peca = undefined;

      tabuleiroHipotetico[0][2].peca = new Rei(cor, this.pecaService);
      tabuleiroHipotetico[0][3].peca = new Torre(cor, this.pecaService);

      posicaoRei = new Posicao(0, 2);
    }

    var xeque: boolean = this.xequeService.verificarXequeProximoTurno(
      cor,
      posicaoRei!,
      tabuleiroHipotetico
    );

    if (xeque == true) return false;
    else return true;
  }

  private verificarSegurancaAposRoqueDuplo(
    cor: string,
    posicaoRoque: string,
    tabuleiro: Casa[][]
  ): string {
    var xequeLeft = this.verificarSegurancaAposRoque(
      cor,
      posicaoRoque + '-left',
      tabuleiro
    );

    var xequeRight = this.verificarSegurancaAposRoque(
      cor,
      posicaoRoque + '-right',
      tabuleiro
    );

    if (xequeLeft == true && xequeRight == true) return cor;
    else if (xequeLeft == true && xequeRight == false) return cor + '-left';
    else if (xequeLeft == false && xequeRight == true) return cor + '-right';
    else return '';
  }
}
