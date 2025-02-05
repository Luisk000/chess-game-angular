import { Component, OnInit } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { Peca } from '../../models/peca.model';
import { Cavalo } from '../../models/pecas/cavalo.model';
import { Bispo } from '../../models/pecas/bispo.model';
import { Peao } from '../../models/pecas/peao.model';
import { Rainha } from '../../models/pecas/rainha.mode';
import { Rei } from '../../models/pecas/rei.model';
import { Torre } from '../../models/pecas/torre.model';
import { PecaService } from '../../services/peca.service';
import { Posicao } from '../../models/posicao.model';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
})
export class TabuleiroComponent implements OnInit {
  colunaCasasAcao: Casa[][] = [];
  colunaCasasTabuleiro: Casa[][] = [];
  acoesPecaSelecionada: Casa[] = [];

  casaPecaSelecionada: Casa | undefined;
  posicaoPecaSelecionada: Posicao | undefined;

  timeJogando = 'branco';

  constructor(private pecaService: PecaService) {}

  async ngOnInit() {
    await this.definirArray();
    await this.prepararPecas();
  }

  async definirArray() {
    for (let i = 0; i <= 7; i++) {
      let coluna = 'par';
      if (i % 2 != 0) coluna = 'impar';

      this.colunaCasasTabuleiro[i] = [];
      for (let j = 0; j <= 7; j++) {
        this.colunaCasasTabuleiro[i].push(new Casa());
      }

      this.colunaCasasAcao = JSON.parse(
        JSON.stringify(this.colunaCasasTabuleiro)
      );
      await this.definirCasas(this.colunaCasasTabuleiro[i], coluna);
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

  async prepararPecas() {
    for (let i = 0; i <= 7; i++) {
      this.colunaCasasAcao[1][i].peca = new Peao('preto', this.pecaService);
      this.colunaCasasAcao[6][i].peca = new Peao('branco', this.pecaService);
    }

    this.colunaCasasAcao[0][0].peca = new Torre('preto', this.pecaService);
    this.colunaCasasAcao[0][7].peca = new Torre('preto', this.pecaService);
    this.colunaCasasAcao[7][0].peca = new Torre('branco', this.pecaService);
    this.colunaCasasAcao[7][7].peca = new Torre('branco', this.pecaService);

    this.colunaCasasAcao[0][1].peca = new Cavalo('preto', this.pecaService);
    this.colunaCasasAcao[0][6].peca = new Cavalo('preto', this.pecaService);
    this.colunaCasasAcao[7][1].peca = new Cavalo('branco', this.pecaService);
    this.colunaCasasAcao[7][6].peca = new Cavalo('branco', this.pecaService);

    this.colunaCasasAcao[0][2].peca = new Bispo('preto', this.pecaService);
    this.colunaCasasAcao[0][5].peca = new Bispo('preto', this.pecaService);
    this.colunaCasasAcao[7][2].peca = new Bispo('branco', this.pecaService);
    this.colunaCasasAcao[7][5].peca = new Bispo('branco', this.pecaService);

    this.colunaCasasAcao[0][4].peca = new Rei('preto', this.pecaService);
    this.colunaCasasAcao[7][4].peca = new Rei('branco', this.pecaService);

    this.colunaCasasAcao[0][3].peca = new Rainha('preto', this.pecaService);
    this.colunaCasasAcao[7][3].peca = new Rainha('branco', this.pecaService);
  }

  verificarMovimentos(peca: Peca, coluna: number, linha: number) {
    if (peca.cor === this.timeJogando) {
      this.casaPecaSelecionada = this.colunaCasasAcao[coluna][linha];
      this.posicaoPecaSelecionada = new Posicao(coluna, linha);
      peca.verMovimentosPossiveis(
        this.posicaoPecaSelecionada,
        peca.cor,
        this.colunaCasasAcao
      );
      if (peca.acoes) {
        this.apagarLocaisAnteriores();
        for (let acao of peca.acoes) {
          let acaoPecaSelecionada =
            this.colunaCasasAcao[acao.coluna][acao.linha];
          acaoPecaSelecionada.cor = 'LimeGreen';
          this.acoesPecaSelecionada.push(acaoPecaSelecionada);
        }
      }
    }
  }

  apagarLocaisAnteriores() {
    for (let local of this.acoesPecaSelecionada) {
      local.cor = '';
    }
  }

  moverPeca(casa: Casa) {
    if (casa.cor === 'LimeGreen') {
      casa.peca = this.casaPecaSelecionada?.peca;
      this.casaPecaSelecionada = undefined;
      this.colunaCasasAcao[this.posicaoPecaSelecionada!.coluna][
        this.posicaoPecaSelecionada!.linha
      ].peca = undefined;
      this.apagarLocaisAnteriores();
      this.mudarTimeJogando();
      this.verificarPeaoIniciando(casa.peca!);
    }
  }

  verificarPeaoIniciando(peca: Peca){
    if (peca instanceof Peao && peca.iniciando == true)
      peca.iniciando = false;
  }

  mudarTimeJogando(){
    if (this.timeJogando === "branco")
      this.timeJogando = "preto"
    else
     this.timeJogando = "branco"
  }
}
