import { Injectable } from '@angular/core';
import { Casa } from '../models/casa.model';
import { Posicao } from '../models/posicao.model';
import { Peca } from '../models/peca.model';
import { Rei } from '../models/pecas/rei.model';
import { Bispo } from '../models/pecas/bispo.model';
import { Torre } from '../models/pecas/torre.model';
import { Rainha } from '../models/pecas/rainha.mode';
import { Cavalo } from '../models/pecas/cavalo.model';
import { Peao } from '../models/pecas/peao.model';
import { PecaService } from './peca.service';

@Injectable({
  providedIn: 'root',
})
export class XequeService {
  constructor(private pecaService: PecaService) {}

  verificarXeque(
    cor: string,
    posicaoRei: Posicao,
    tabuleiro: Casa[][]
  ): Posicao | undefined {
    let xeques: Posicao[] = [];

    for (let colIndex = 0; colIndex <= 7; colIndex++) {
      for (let caIndex = 0; caIndex <= 7; caIndex++) {
        var casa = tabuleiro[colIndex][caIndex];
        if (casa.peca && casa.peca.cor != cor) {
          let xeque = this.findPosicao(posicaoRei, casa.peca.acoes);
          if (xeque != undefined) xeques.push(new Posicao(colIndex, caIndex));
        }
      }
    }

    if (xeques.length > 1) {
      console.log('?????????????');
    }

    if (xeques.length == 0) return undefined;
    else {
      var xequeMate = this.verificarEscaparXeque(
        xeques[0],
        posicaoRei,
        cor,
        tabuleiro
      );
      console.log(xequeMate);
      //encerrar o jogo se xeque-mate for true

      return xeques[0];
    }
  }

  verificarSegurancaAposMovimentos(
    posicaoPeca: Posicao,
    peca: Peca,
    posicaoRei: Posicao,
    tabuleiro: Casa[][]
  ) {
    var acoesSeguras: Posicao[] = [];

    for (let acao of peca.acoes) {
      var acaoSegura = this.verificarSegurancaAposMovimento(
        posicaoPeca,
        acao,
        peca,
        posicaoRei,
        tabuleiro
      );
      if (acaoSegura == true) acoesSeguras.push(acao);
    }
    peca.acoes = acoesSeguras;
  }

  private verificarSegurancaAposMovimento(
    posicaoAntiga: Posicao,
    posicaoNova: Posicao,
    pecaNova: Peca,
    posicaoRei: Posicao,
    tabuleiro: Casa[][]
  ) {
    var tabuleiroHipotetico = JSON.parse(JSON.stringify(tabuleiro));
    this.retrieveInstances(tabuleiroHipotetico);

    tabuleiroHipotetico[posicaoAntiga.coluna][posicaoAntiga.linha].peca =
      undefined;
    tabuleiroHipotetico[posicaoNova.coluna][posicaoNova.linha].peca = pecaNova;

    if (pecaNova.nome == 'rei') posicaoRei = posicaoNova;

    if (
      this.verificarXequeProximoTurno(
        pecaNova.cor,
        posicaoRei,
        tabuleiroHipotetico
      ) == true
    )
      return false;
    else return true;
  }

  private verificarXequeProximoTurno(
    cor: string,
    posicaoRei: Posicao,
    tabuleiro: Casa[][]
  ) {
    let haXeque = false;

    for (let colIndex = 0; colIndex <= 7; colIndex++) {
      for (let caIndex = 0; caIndex <= 7; caIndex++) {
        var casa: Casa = tabuleiro[colIndex][caIndex];
        if (casa.peca) {
          casa.peca.verMovimentosPossiveis(
            new Posicao(colIndex, caIndex),
            casa.peca.cor,
            tabuleiro
          );
          if (casa.peca.cor != cor) {
            let xeque = this.findPosicao(posicaoRei, casa.peca.acoes);

            if (xeque != undefined) haXeque = true;
          }
        }
      }
    }

    return haXeque;
  }

  private verificarEscaparXeque(
    posicaoXeque: Posicao,
    posicaoRei: Posicao,
    cor: string,
    tabuleiro: Casa[][]
  ) {
    var xequeMate = true;
    var rei: Peca = tabuleiro[posicaoRei.coluna][posicaoRei.linha].peca!;
    var escaparRei: Posicao[] = this.escaparXequeMovendoRei(
      posicaoRei,
      rei,
      tabuleiro
    );

    for (let colIndex = 0; colIndex <= 7; colIndex++) {
      for (let caIndex = 0; caIndex <= 7; caIndex++) {
        var casa = tabuleiro[colIndex][caIndex];
        if (casa.peca && casa.peca.cor === cor) {
          var acoesPeca: Posicao[] = [];
          var posicaoPeca = new Posicao(colIndex, caIndex);

          var movimentoComer: Posicao | undefined = this.escaparXequeComendo(
            posicaoXeque,
            posicaoRei,
            posicaoPeca,
            casa.peca,
            tabuleiro
          );
          if (movimentoComer != undefined) acoesPeca.push(movimentoComer);

          if (casa.peca.nome != 'rei') {
            var movimentosBloquear: Posicao[] = this.escaparXequeBloqueando(
              posicaoXeque,
              posicaoRei,
              posicaoPeca,
              casa.peca,
              tabuleiro
            );
            if (movimentosBloquear.length > 0)
              acoesPeca.push(...movimentosBloquear);
          }

          casa.peca.acoes = acoesPeca;
          if (acoesPeca.length > 0) xequeMate = false;
        }
      }
    }

    if (escaparRei.length > 0) {
      rei.acoes.push(...escaparRei);
      xequeMate = false;
    }

    return xequeMate;
  }

  private escaparXequeComendo(
    posicaoXeque: Posicao,
    posicaoRei: Posicao,
    posicaoPeca: Posicao,
    peca: Peca,
    tabuleiro: Casa[][]
  ): Posicao | undefined {
    var movimentoComer = this.findPosicao(posicaoXeque, peca.acoes);
    if (movimentoComer == undefined) return undefined;
    else {
      let novaPosicao = new Posicao(
        movimentoComer.coluna,
        movimentoComer.linha
      );

      var podeEscapar: boolean = this.verificarSegurancaAposMovimento(
        new Posicao(posicaoPeca.coluna, posicaoPeca.linha),
        novaPosicao,
        peca,
        posicaoRei,
        tabuleiro
      );
      if (podeEscapar == true) return movimentoComer;
      else return undefined;
    }
  }

  private escaparXequeBloqueando(
    posicaoXeque: Posicao,
    posicaoRei: Posicao,
    posicaoPeca: Posicao,
    peca: Peca,
    tabuleiro: Casa[][]
  ): Posicao[] {
    var posicoesEntre: Posicao[] = this.getPosicoesEntre(
      posicaoXeque,
      posicaoRei
    );

    var acoesBloquear = peca.acoes.filter((a) =>
      posicoesEntre.some((b) => b.coluna == a.coluna && b.linha == a.linha)
    );

    if (acoesBloquear.length > 0) {
      var acoesBloquearSeguras: Posicao[] = [];

      for (let acao of acoesBloquear) {
        var seguro: boolean = this.verificarSegurancaAposMovimento(
          new Posicao(posicaoPeca.coluna, posicaoPeca.linha),
          new Posicao(acao.coluna, acao.linha),
          peca,
          posicaoRei,
          tabuleiro
        );
        if (seguro) acoesBloquearSeguras.push(acao);
      }

      return acoesBloquearSeguras;
    } else {
      return [];
    }
  }

  private escaparXequeMovendoRei(
    posicaoRei: Posicao,
    rei: Peca,
    tabuleiro: Casa[][]
  ): Posicao[] {
    let acoesRei: Posicao[] = [];
    for (let acao of rei.acoes) {
      var podeEscapar = this.verificarSegurancaAposMovimento(
        posicaoRei,
        acao,
        rei,
        acao,
        tabuleiro
      );

      if (podeEscapar) acoesRei.push(acao);
    }
    return acoesRei;
  }

  private retrieveInstances(tabuleiro: Casa[][]) {
    for (let coluna of tabuleiro) {
      for (let casa of coluna) {
        if (casa.peca) {
          if (casa.peca.nome == 'peao')
            casa.peca = new Peao(casa.peca.cor, this.pecaService);
          else if (casa.peca.nome == 'torre')
            casa.peca = new Torre(casa.peca.cor, this.pecaService);
          else if (casa.peca.nome == 'bispo')
            casa.peca = new Bispo(casa.peca.cor, this.pecaService);
          else if (casa.peca.nome == 'cavalo')
            casa.peca = new Cavalo(casa.peca.cor, this.pecaService);
          else if (casa.peca.nome == 'rei')
            casa.peca = new Rei(casa.peca.cor, this.pecaService);
          else if (casa.peca.nome == 'rainha')
            casa.peca = new Rainha(casa.peca.cor, this.pecaService);
        }
      }
    }
  }

  private getPosicoesEntre(posicaoA: Posicao, posicaoB: Posicao) {
    var acoes: Posicao[] = [];

    var colA = posicaoA.coluna;
    var colB = posicaoB.coluna;
    var caA = posicaoA.linha;
    var caB = posicaoB.linha;

    if (colA == colB && caA > caB) {
      caB++;
      while (caA > caB) {
        acoes.push(new Posicao(colB, caB));
        caB++;
      }
    } else if (colA == colB && caA < caB) {
      caB--;
      while (caA < caB) {
        acoes.push(new Posicao(colB, caB));
        caB--;
      }
    } else if (colA > colB && caA == caB) {
      colB++;
      while (colA > colB) {
        acoes.push(new Posicao(colB, caB));
        colB++;
      }
    } else if (colA < colB && caA == caB) {
      colB--;
      while (colA < colB) {
        acoes.push(new Posicao(colB, caB));
        colB--;
      }
    } else if (colA > colB && caA > caB) {
      colB++;
      caB++;
      while (colA > colB && caA > caB) {
        acoes.push(new Posicao(colB, caB));
        colB++;
        caB++;
      }
    } else if (colA < colB && caA < caB) {
      colB--;
      caB--;
      while (colA < colB && caA < caB) {
        acoes.push(new Posicao(colB, caB));
        colB--;
        caB--;
      }
    } else if (colA < colB && caA > caB) {
      colB--;
      caB++;
      while (colA < colB && caA > caB) {
        acoes.push(new Posicao(colB, caB));
        colB--;
        caB++;
      }
    } else if (colA > colB && caA < caB) {
      colB++;
      caB--;
      while (colA > colB && caA < caB) {
        acoes.push(new Posicao(colB, caB));
        colB++;
        caB--;
      }
    }

    return acoes;
  }

  private findPosicao(posicao: Posicao, posicoes: Posicao[]) {
    return posicoes.find(
      (a) => a.coluna == posicao.coluna && a.linha == posicao.linha
    );
  }
}
