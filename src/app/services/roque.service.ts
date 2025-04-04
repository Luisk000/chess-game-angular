import { Injectable } from '@angular/core';
import { Rei } from '../models/pecas/rei.model';
import { Torre } from '../models/pecas/torre.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { XequeService } from './xeque.service';

@Injectable({
  providedIn: 'root'
})
export class RoqueService {

  constructor() { }

  verificarRoquePequeno(time: string, tabuleiro: Casa[][]): boolean{
    if (this.verificarRoqueRei(time, tabuleiro) &&
        this.verificarRoquePequenoTorre(time, tabuleiro) &&
        this.permitirRoquePequeno(time, tabuleiro)
    )
      return true;

    else
      return false;
  }

  verificarRoqueGrande(time: string, tabuleiro: Casa[][]): boolean{
    if (this.verificarRoqueRei(time, tabuleiro) &&
        this.verificarRoqueGrandeTorre(time, tabuleiro) &&
        this.permitirRoqueGrande(time, tabuleiro)
    )
      return true;
      
    else
      return false;
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

  private verificarRoqueRei(time: string, tabuleiro: Casa[][]): boolean{
    if (time === "branco" && 
      tabuleiro[7][4].peca instanceof Rei && 
      tabuleiro[7][4].peca.iniciando == true
    )
      return true;       
      
    else if (time === "preto" && 
      tabuleiro[0][4].peca instanceof Rei && 
      tabuleiro[0][4].peca.iniciando == true
    )
      return true;

    else
      return false;
      
  }

  private verificarRoquePequenoTorre(time: string, tabuleiro: Casa[][]): boolean{
    if (time === "branco"){
      if (tabuleiro[7][7].peca instanceof Torre &&
        tabuleiro[7][7].peca.iniciando == true)
        return true;
    }
    else {
      if (tabuleiro[0][7].peca instanceof Torre &&
        tabuleiro[0][7].peca.iniciando == true)
        return true;
    }
    return false;
  }

  private verificarRoqueGrandeTorre(time: string, tabuleiro: Casa[][]): boolean{
    if (time === "branco"){
      if (tabuleiro[7][0].peca instanceof Torre &&
        tabuleiro[7][0].peca.iniciando == true){
          return true;
        }
        
    }
    else {
      if (tabuleiro[0][0].peca instanceof Torre &&
        tabuleiro[0][0].peca.iniciando == true)
        return true;
    }
    return false;
  }

  private permitirRoquePequeno(time: string, tabuleiro: Casa[][]): boolean{
    if (time === "branco" &&
      tabuleiro[7][5].peca == undefined &&
      tabuleiro[7][6].peca == undefined
    )
      return true;  

    else if (time === "preto" &&
      tabuleiro[0][5].peca == undefined &&
      tabuleiro[0][6].peca == undefined
    )
      return true;
        
    else
      return false;
  }

  private permitirRoqueGrande(time: string, tabuleiro: Casa[][]){
    if (time === "branco" &&
      tabuleiro[7][1].peca == undefined &&
      tabuleiro[7][2].peca == undefined &&
      tabuleiro[7][3].peca == undefined
    )
      return true;
  
    else if (time === "preto" &&
      tabuleiro[0][1].peca == undefined &&
      tabuleiro[0][2].peca == undefined &&
      tabuleiro[0][3].peca == undefined
    )
      return true;
        
    else
      return false;
  }

}
