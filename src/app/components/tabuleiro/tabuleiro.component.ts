import { Component, OnInit } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { InitPeca } from '../../models/init-peca.model';
import { Cavalo } from '../../models/pecas/cavalo.model';
import { Bispo } from '../../models/pecas/bispo.model';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,
  
  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css'
})
export class TabuleiroComponent implements OnInit {
  
  colunaCasas: Casa[][] = [];

  ngOnInit() {
    this.definirArray();
    this.designarPecas();

    let cavalo: Bispo = new Bispo("branco");
    console.log(cavalo)
  }

  definirArray(){
    for (let i = 0; i < 8; i++) {
      
      let coluna = "par";
      if (i % 2 != 0) coluna = "impar";

      this.colunaCasas[i] = [];
      for (let j = 0; j < 8; j++) {
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
          casa.cor = "black"
      }
      else {
        if (i % 2 == 0)
          casa.cor = "black"
        else
          casa.cor = "white"
      }      
      i++;
    }
  }

  designarPecas(){

    for (let i = 0; i < 8; i++){
      this.colunaCasas[1][i].peca = "peao";
      this.colunaCasas[6][i].peca = "peao";
    }

    this.colunaCasas[0][0].peca = "torre";
    this.colunaCasas[0][7].peca = "torre";
    this.colunaCasas[7][0].peca = "torre";
    this.colunaCasas[7][7].peca = "torre";

    this.colunaCasas[0][1].peca = "cavalo";
    this.colunaCasas[0][6].peca = "cavalo";
    this.colunaCasas[7][1].peca = "cavalo";
    this.colunaCasas[7][6].peca = "cavalo";

    this.colunaCasas[0][2].peca = "bispo";
    this.colunaCasas[0][5].peca = "bispo";
    this.colunaCasas[7][2].peca = "bispo";
    this.colunaCasas[7][5].peca = "bispo";

    this.colunaCasas[0][4].peca = "rei";
    this.colunaCasas[7][4].peca = "rei";

    this.colunaCasas[0][3].peca = "rainha";
    this.colunaCasas[7][3].peca = "rainha";
  }
}
