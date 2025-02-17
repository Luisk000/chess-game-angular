import { Injectable } from '@angular/core';
import { Peao } from '../models/pecas/peao.model';
import { Posicao } from '../models/posicao.model';
import { Torre } from '../models/pecas/torre.model';
import { Rei } from '../models/pecas/rei.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Cavalo } from '../models/pecas/cavalo.model';
import { Bispo } from '../models/pecas/bispo.model';
import { Rainha } from '../models/pecas/rainha.mode';

@Injectable({
  providedIn: 'root'
})
export class TabuleiroService {

  constructor() { }
  
  async prepararPecas(tabuleiro: Casa[][], pecaService: PecaService){
    for (let i = 0; i <= 7; i++) {
          tabuleiro[1][i].peca = new Peao('preto', pecaService);
          tabuleiro[6][i].peca = new Peao('branco', pecaService);
        }
    
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

  verificarEnPassant(peao: Peao, coluna: number, linha: number): Posicao | undefined {
    let posicaoEnPassant = undefined;
  
    if (peao.cor == 'branco' && coluna == 4)
      posicaoEnPassant = new Posicao(coluna + 1, linha);
    else if (peao.cor == 'preto' && coluna == 3)
      posicaoEnPassant = new Posicao(coluna - 1, linha);

    return posicaoEnPassant;
  }

  verificarPosicaoRoque(peca: Torre | Rei): string{
    let posicaoRoque = "";
    if (peca.cor == "branco"){
      if (peca.roquePequeno == true && peca.roqueGrande == true)
        posicaoRoque = "branco";
      else if (peca.roquePequeno == true)
        posicaoRoque = "branco-right";
      else if (peca.roqueGrande == true)
        posicaoRoque = "branco-left";
    }
    else{
      if (peca.roquePequeno == true && peca.roqueGrande == true)
        posicaoRoque = "preto";
      else if (peca.roquePequeno == true)
        posicaoRoque = "preto-right";
      else if (peca.roqueGrande == true)
        posicaoRoque = "preto-left";
    }    
    return posicaoRoque;
  }

  realizarRoque(posicao: string, tabuleiro: Casa[][], pecaService: PecaService): Casa[][]{
    if (posicao == "branco-right"){
      tabuleiro[7][7].peca = undefined;
      tabuleiro[7][4].peca = undefined;
      tabuleiro[7][6].peca = new Rei("branco", pecaService);
      tabuleiro[7][5].peca = new Torre("branco", pecaService);
    }
    else if (posicao == "preto-right"){
      tabuleiro[0][7].peca = undefined;
      tabuleiro[0][4].peca = undefined;
      tabuleiro[0][6].peca = new Rei("preto", pecaService);
      tabuleiro[0][5].peca = new Torre("preto", pecaService);
    }
    if (posicao == "branco-left"){
      tabuleiro[7][0].peca = undefined;
      tabuleiro[7][4].peca = undefined;
      tabuleiro[7][2].peca = new Rei("branco", pecaService);
      tabuleiro[7][3].peca = new Torre("branco", pecaService);
    }
    else if(posicao == "preto-left"){
      tabuleiro[0][0].peca = undefined;
      tabuleiro[0][4].peca = undefined;
      tabuleiro[0][2].peca = new Rei("preto", pecaService);
      tabuleiro[0][3].peca = new Torre("preto", pecaService);
    }
    return tabuleiro;
  }
}
