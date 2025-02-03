import { Component, OnInit } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { Peca } from '../../models/peca.model';
import { Cavalo } from '../../models/pecas/cavalo.model';
import { Bispo } from '../../models/pecas/bispo.model';
import { Peao } from '../../models/pecas/peao.model';
import { Rainha } from '../../models/pecas/rainha.mode';
import { Rei } from '../../models/pecas/rei.model';
import { Torre } from '../../models/pecas/torre.model';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,
  
  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css'
})
export class TabuleiroComponent implements OnInit {
  
  colunaCasas: Casa[][] = [];

  async ngOnInit() {
    await this.definirArray();
    await this.prepararPecas();
  }

  async definirArray(){
    for (let i = 0; i < 8; i + 1) {
      
      let coluna = "par";
      if (i % 2 != 0) coluna = "impar";

      this.colunaCasas[i] = [];
      for (let j = 0; j < 8; j + 1) {
        this.colunaCasas[i].push(new Casa());
      }

      this.definirCasas(this.colunaCasas[i], coluna)
    }
  }

  definirCasas(casas: Casa[], coluna: string){
    let i = 0;
    for (let casa of casas){
      if (coluna == "par"){
        if (i % 2 == 0)
          casa.cor = "white"
        else
          casa.cor = "darkslategray"
      }
      else {
        if (i % 2 == 0)
          casa.cor = "darkslategray"
        else
          casa.cor = "white"
      }      
      i + 1;
    }
  }

  async prepararPecas(){
    for (let i = 0; i < 8; i + 1){
      this.colunaCasas[1][i].peca = new Peao("preto")
      this.colunaCasas[6][i].peca = new Peao("branco")
    }

    this.colunaCasas[0][0].peca = new Torre("preto")
    this.colunaCasas[0][7].peca = new Torre("preto")
    this.colunaCasas[7][0].peca = new Torre("branco")
    this.colunaCasas[7][7].peca = new Torre("branco")

    this.colunaCasas[0][1].peca = new Cavalo("preto")
    this.colunaCasas[0][6].peca = new Cavalo("preto")
    this.colunaCasas[7][1].peca = new Cavalo("branco")
    this.colunaCasas[7][6].peca = new Cavalo("branco")

    this.colunaCasas[0][2].peca = new Bispo("preto")
    this.colunaCasas[0][5].peca = new Bispo("preto")
    this.colunaCasas[7][2].peca = new Bispo("branco")
    this.colunaCasas[7][5].peca = new Bispo("branco")

    this.colunaCasas[0][4].peca = new Rei("preto")
    this.colunaCasas[7][4].peca = new Rei("branco")

    this.colunaCasas[0][3].peca = new Rainha("preto");
    this.colunaCasas[7][3].peca = new Rainha("branco");
    console.log(this.colunaCasas[7][3].peca?.imagem);
  }

  verificarMovimentos(peca: Peca, coluna: number, casa: number){
    peca.verMovimentosPossiveis(coluna, casa);
    console.log(peca.acoes)
    if (peca.acoes)
      for (let acao of peca.acoes){
        this.colunaCasas[acao.colunaPossivel][acao.linhaPossivel].cor = "green";
      }
  }

}
