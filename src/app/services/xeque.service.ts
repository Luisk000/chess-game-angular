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
import { Subject } from 'rxjs';
import * as flatted from 'flatted';

@Injectable({
  providedIn: 'root',
})
export class XequeService {

  constructor(private pecaService: PecaService) {}

  xequeMate = false;
  casaXeque: Casa | undefined;

  private xequeSubject = new Subject<void>();
  private xequeMateSubject = new Subject<void>();

  xequeObs = this.xequeSubject.asObservable();
  xequeMateObs = this.xequeMateSubject.asObservable();

  verificarXeque(posicaoRei: Posicao, timeJogando: string, tabuleiro: Casa[][]){
    let xeque: Posicao | undefined = this.verificarPosicoesXeque(
      timeJogando,
      posicaoRei!,
      tabuleiro
    );

    if (this.isXequeMate()){
      this.xequeMateSubject.next();
    }
    else if (xeque != undefined) {
      this.casaXeque = tabuleiro[xeque.coluna][xeque.linha];
      this.casaXeque.cor = 'red';
      this.xequeSubject.next()
    }
  }

  apagarLocalXeque() {
    if (this.casaXeque){
      this.casaXeque.cor = '';
      this.casaXeque = undefined;
    }
  }

  manterXeques(casa: Casa) {
    if (this.casaXeque == casa)
      casa.cor = 'red';
  }

  verificarPosicoesXeque(
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
      console.log("Bug: dois xeques simultâneos");
    }

    if (xeques.length == 0) 
      return undefined;
    else {
      var xequeMate = this.verificarEscaparXeque(
        xeques[0],
        posicaoRei,
        cor,
        tabuleiro
      );
      this.xequeMate = xequeMate;

      return xeques[0];
    }
  }

  isXequeMate(): boolean{
    return this.xequeMate;
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
    let tabuleiroHipotetico = flatted.parse(flatted.stringify(tabuleiro));
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

  verificarSegurancaAposRoque(
    cor: string,
    posicaoRoque: string,
    tabuleiro: Casa[][]
  ){
    var tabuleiroHipotetico: Casa[][] = JSON.parse(JSON.stringify(tabuleiro));
    this.retrieveInstances(tabuleiroHipotetico);
    var posicaoRei: Posicao;

    if (posicaoRoque === "branco-right"){
      tabuleiroHipotetico[7][4].peca = undefined;
      tabuleiroHipotetico[7][7].peca = undefined;

      tabuleiroHipotetico[7][6].peca = new Rei(cor, this.pecaService)
      tabuleiroHipotetico[7][5].peca = new Torre(cor, this.pecaService)

      posicaoRei = new Posicao(7, 6);
    }
    else if (posicaoRoque === "branco-left"){
      tabuleiroHipotetico[7][4].peca = undefined;
      tabuleiroHipotetico[7][0].peca = undefined;

      tabuleiroHipotetico[7][2].peca = new Rei(cor, this.pecaService)
      tabuleiroHipotetico[7][3].peca = new Torre(cor, this.pecaService)

      posicaoRei = new Posicao(7, 2);
    }
    else if (posicaoRoque === "preto-right"){
      tabuleiroHipotetico[0][4].peca = undefined;
      tabuleiroHipotetico[0][7].peca = undefined;

      tabuleiroHipotetico[0][6].peca = new Rei(cor, this.pecaService)
      tabuleiroHipotetico[0][5].peca = new Torre(cor, this.pecaService)

      posicaoRei = new Posicao(0, 6);
    }
    else if (posicaoRoque === "preto-left"){
      tabuleiroHipotetico[0][4].peca = undefined;
      tabuleiroHipotetico[0][0].peca = undefined;

      tabuleiroHipotetico[0][2].peca = new Rei(cor, this.pecaService)
      tabuleiroHipotetico[0][3].peca = new Torre(cor, this.pecaService)

      posicaoRei = new Posicao(0, 2);
    }

    var xeque: boolean = 
      this.verificarXequeProximoTurno(cor, posicaoRei!, tabuleiroHipotetico)

    if (xeque == true)
      return false;
    else
      return true;
    
  }

  verificarXequeProximoTurno(
    cor: string,
    posicaoRei: Posicao,
    tabuleiro: Casa[][]
  ) {
    let haXeque = false;

    for (let colIndex = 0; colIndex <= 7; colIndex++) {
      for (let caIndex = 0; caIndex <= 7; caIndex++) {
        var casa: Casa = tabuleiro[colIndex][caIndex];
        if (casa.peca && casa.peca.cor != cor) {
          casa.peca.verMovimentosPossiveis(
            new Posicao(colIndex, caIndex),
            casa.peca.cor,
            tabuleiro
          );

          let xeque = this.findPosicao(posicaoRei, casa.peca.acoes);

          if (xeque != undefined) 
            haXeque = true;
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

          var movimentoCapturar: Posicao | undefined = this.escaparXequeCapturando(
            posicaoXeque,
            posicaoRei,
            posicaoPeca,
            casa.peca,
            tabuleiro
          );
          if (movimentoCapturar != undefined) acoesPeca.push(movimentoCapturar);

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

  private escaparXequeCapturando(
    posicaoXeque: Posicao,
    posicaoRei: Posicao,
    posicaoPeca: Posicao,
    peca: Peca,
    tabuleiro: Casa[][]
  ): Posicao | undefined {
    var movimentoCapturar = this.findPosicao(posicaoXeque, peca.acoes);
    if (movimentoCapturar == undefined) return undefined;
    else {
      let novaPosicao = new Posicao(
        movimentoCapturar.coluna,
        movimentoCapturar.linha
      );

      var podeEscapar: boolean = this.verificarSegurancaAposMovimento(
        new Posicao(posicaoPeca.coluna, posicaoPeca.linha),
        novaPosicao,
        peca,
        posicaoRei,
        tabuleiro
      );
      if (podeEscapar == true) return movimentoCapturar;
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

  retrieveInstances(tabuleiro: Casa[][]) {
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
