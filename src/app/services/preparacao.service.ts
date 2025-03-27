import { Injectable } from '@angular/core';
import { Rainha } from '../models/pecas/rainha.mode';
import { Rei } from '../models/pecas/rei.model';
import { Bispo } from '../models/pecas/bispo.model';
import { Cavalo } from '../models/pecas/cavalo.model';
import { Torre } from '../models/pecas/torre.model';
import { Peao } from '../models/pecas/peao.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';

@Injectable({
  providedIn: 'root',
})
export class PreparacaoService {
  constructor() {}

  async prepararTabuleiroBackground() {
    let tabuleiroBackground: Casa[][] = [];

    await this.definirColunas(tabuleiroBackground);

    return tabuleiroBackground;
  }

  async prepararTabuleiroJogo(tabuleiroBackground: Casa[][], pecaService: PecaService) {
    let tabuleiroCopia = await JSON.parse(
      JSON.stringify(tabuleiroBackground)
    );

    let tabuleiroJogo = await this.prepararPecas(
      tabuleiroCopia,
      pecaService
    );

    return tabuleiroJogo;
  }

  async prepararPecas(tabuleiro: Casa[][], pecaService: PecaService) {
   /* for (let i = 0; i <= 7; i++) {
      tabuleiro[1][i].peca = new Peao('preto', pecaService);
      tabuleiro[6][i].peca = new Peao('branco', pecaService);
    }   */

    tabuleiro[0][0].peca = new Torre('preto', pecaService);
    tabuleiro[0][7].peca = new Torre('preto', pecaService);
    tabuleiro[7][0].peca = new Torre('branco', pecaService);
    tabuleiro[7][7].peca = new Torre('branco', pecaService);

    tabuleiro[0][1].peca = new Cavalo('preto', pecaService);
    tabuleiro[0][6].peca = new Cavalo('preto', pecaService);
    tabuleiro[7][1].peca = new Cavalo('branco', pecaService);
    tabuleiro[7][6].peca = new Cavalo('branco', pecaService);

    tabuleiro[0][2].peca = new Bispo('preto', pecaService);
    tabuleiro[0][5].peca = new Bispo('preto', pecaService);
    tabuleiro[7][2].peca = new Bispo('branco', pecaService);
    tabuleiro[7][5].peca = new Bispo('branco', pecaService);

    tabuleiro[0][4].peca = new Rei('preto', pecaService);
    tabuleiro[7][4].peca = new Rei('branco', pecaService);

    tabuleiro[0][3].peca = new Rainha('preto', pecaService);
    tabuleiro[7][3].peca = new Rainha('branco', pecaService);

    return tabuleiro;
  }

  async definirColunas(tabuleiroBackground: Casa[][]) {
    for (let i = 0; i <= 7; i++) {
      let coluna = 'par';
      if (i % 2 != 0) coluna = 'impar';

      tabuleiroBackground[i] = [];
      for (let j = 0; j <= 7; j++) {
        tabuleiroBackground[i].push(new Casa());
      }
      await this.definirCasas(tabuleiroBackground[i], coluna);
    }
  }

  async definirCasas(casas: Casa[], coluna: string) {
    let i = 0;
    for (let casa of casas) {
      if (coluna === 'par') {
        if (i % 2 == 0) casa.cor = 'white';
        else casa.cor = 'darkslategray';
      } else {
        if (i % 2 == 0) casa.cor = 'darkslategray';
        else casa.cor = 'white';
      }
      i++;
    }
  }
}
