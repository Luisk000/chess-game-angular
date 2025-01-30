import { Component, OnInit } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { InitPeca } from '../../models/init-peca.model';
import { Cavalo } from '../../models/pecas/cavalo.model';
import { Bispo } from '../../models/pecas/bispo.model';
import { Peao } from '../../models/pecas/peao.model';

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
    this.designarPecasTeste();

    let peao: Peao = new Peao("branco");
    let teste = peao.verificarAcoes(3, 2);
    console.log(teste)
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

  designarPecasTeste(){

    for (let i = 0; i < 8; i++){
      this.colunaCasas[1][i].peca = "peao" + "[1][" + i +"]";
      this.colunaCasas[6][i].peca = "peao" + "[6][" + i +"]";
    }

    this.colunaCasas[0][0].peca = "torre" + "[0][0]";
    this.colunaCasas[0][7].peca = "torre" + "[0][7]";
    this.colunaCasas[7][0].peca = "torre" + "[7][0]";
    this.colunaCasas[7][7].peca = "torre" + "[7][7]";

    this.colunaCasas[0][1].peca = "cavalo" + "[0][1]";
    this.colunaCasas[0][6].peca = "cavalo" + "[0][6]";
    this.colunaCasas[7][1].peca = "cavalo" + "[7][1]";
    this.colunaCasas[7][6].peca = "cavalo" + "[7][6]";

    this.colunaCasas[0][2].peca = "bispo" + "[0][2]";
    this.colunaCasas[0][5].peca = "bispo" + "[0][5]";
    this.colunaCasas[7][2].peca = "bispo" + "[7][2]";
    this.colunaCasas[7][5].peca = "bispo" + "[7][5]";

    this.colunaCasas[0][4].peca = "rei" + "[0][4]";
    this.colunaCasas[7][4].peca = "rei" + "[7][4]";

    this.colunaCasas[0][3].peca = "rainha" + "[0][3]";
    this.colunaCasas[7][3].peca = "rainha" + "[7][3]";
  }
}
