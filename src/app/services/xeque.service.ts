import { Injectable } from '@angular/core';
import { Rei } from '../models/pecas/rei.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Posicao } from '../models/posicao.model';

@Injectable({
  providedIn: 'root',
})
export class XequeService {
  constructor(private pecaService: PecaService) {}

  verificarXequeMate(acoes: Posicao[]) {

  }

  verificarXeque(rei: Rei, posicao: Posicao, tabuleiro: Casa[][]) {
    
  }

  verificarXequeRainhaBispo(posicao: Posicao, tabuleiro: Casa[][], cor: string){
    let movimentosDiagonais: Posicao[] = this.pecaService
      .verificarMovimentosDiagonal(posicao, cor, tabuleiro);

    if (movimentosDiagonais)
      for (let movimentoDiagonal of movimentosDiagonais){

    }

  }

  verificarXequeRainhaTorre(posicao: Posicao, tabuleiro: Casa[][], cor: string){
    let movimentosRetos: Posicao[] = this.pecaService
      .verificarMovimentosReto(posicao, cor, tabuleiro);

    if (movimentosRetos)
      for (let movimentosReto of movimentosRetos){
    
    }
  }

  verificarXequeCavalo(posicao: Posicao, tabuleiro: Casa[][], cor: string){

    let acoesPossiveisCavalo = [
      new Posicao(posicao.coluna - 1, posicao.linha + 2),
      new Posicao(posicao.coluna - 1, posicao.linha - 2),
      new Posicao(posicao.coluna + 1, posicao.linha + 2),
      new Posicao(posicao.coluna + 1, posicao.linha - 2),
      new Posicao(posicao.coluna - 2, posicao.linha + 1),
      new Posicao(posicao.coluna - 2, posicao.linha - 1),
      new Posicao(posicao.coluna + 2, posicao.linha + 1),
      new Posicao(posicao.coluna + 2, posicao.linha - 1),
    ];

    let movimentosCavalo: Posicao[] = this.pecaService
      .verificarMovimentos(acoesPossiveisCavalo, cor, tabuleiro);

    if (movimentosCavalo)
      for (let movimentosReto of movimentosCavalo){
    
    }
  }

  verificarXequeRei(posicao: Posicao, tabuleiro: Casa[][], cor: string){
    let acoesPossiveisRei = [
      new Posicao(posicao.coluna + 1, posicao.linha),   
      new Posicao(posicao.coluna - 1, posicao.linha), 
      new Posicao(posicao.coluna, posicao.linha + 1), 
      new Posicao(posicao.coluna, posicao.linha - 1),  
      new Posicao(posicao.coluna + 1, posicao.linha + 1),   
      new Posicao(posicao.coluna - 1, posicao.linha - 1), 
      new Posicao(posicao.coluna + 1, posicao.linha - 1), 
      new Posicao(posicao.coluna - 1, posicao.linha + 1),  
    ];

    let movimentosRei: Posicao[] = this.pecaService
      .verificarMovimentos(acoesPossiveisRei, cor, tabuleiro);

    if (movimentosRei)
      for (let movimentoRei of movimentosRei){
    
    }
  }

  verificarXequePeao(posicao: Posicao, tabuleiro: Casa[][], cor: string){
    let acoesPossiveisPeao;
    if (cor == "branco") 
      acoesPossiveisPeao = [
        new Posicao(posicao.coluna - 1, posicao.linha - 1),   
        new Posicao(posicao.coluna - 1, posicao.linha + 1),  
      ];
    
    else 
      acoesPossiveisPeao = [
        new Posicao(posicao.coluna + 1, posicao.linha - 1),   
        new Posicao(posicao.coluna + 1, posicao.linha + 1),  
      ];
    
    let movimentosPeao: Posicao[] = this.pecaService
      .verificarMovimentosPeaoComer(acoesPossiveisPeao, cor, tabuleiro, undefined);

    if (movimentosPeao)
      for (let movimentoPeao of movimentosPeao){
    
    }
  }
}
