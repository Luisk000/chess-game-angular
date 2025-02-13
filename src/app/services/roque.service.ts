import { Injectable } from '@angular/core';
import { Rei } from '../models/pecas/rei.model';
import { Torre } from '../models/pecas/torre.model';
import { Casa } from '../models/casa.model';

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
        tabuleiro[7][0].peca.iniciando == true)
        return true;
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
