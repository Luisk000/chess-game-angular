import { Injectable } from '@angular/core';
import { Rei } from '../models/pecas/rei.model';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Posicao } from '../models/posicao.model';
import { Peao } from '../models/pecas/peao.model';
import { Cavalo } from '../models/pecas/cavalo.model';
import { Rainha } from '../models/pecas/rainha.mode';
import { Torre } from '../models/pecas/torre.model';
import { Bispo } from '../models/pecas/bispo.model';

@Injectable({
  providedIn: 'root',
})
export class XequeService {
  constructor(private pecaService: PecaService) {}

  verificarXequeMate(acoes: Posicao[]) {
    
  }

  verificarXeque(cor: string, posicao: Posicao, tabuleiro: Casa[][]) {
    let xequesRainhaBispo: Posicao[] = 
      this.verificarXequeRainhaBispo(posicao, tabuleiro, cor);
    let xequesRainhaTorre: Posicao[] = 
      this.verificarXequeRainhaTorre(posicao, tabuleiro, cor);
    let xequesCavalo: Posicao[] = 
      this.verificarXequeCavalo(posicao, tabuleiro, cor);
    let xequesRei: Posicao[] = 
      this.verificarXequeRei(posicao, tabuleiro, cor);
    let xequesPeao: Posicao[] = 
      this.verificarXequePeao(posicao, tabuleiro, cor);

    let xeques: Posicao[] = [];
    xeques.push(
      ...xequesRainhaBispo, 
      ...xequesRainhaTorre, 
      ...xequesCavalo, 
      ...xequesRei, 
      ...xequesPeao
    );
    return xeques;
  }

  verificarXequeRainhaBispo(posicao: Posicao, tabuleiro: Casa[][], cor: string): Posicao[]{
    let movimentosDiagonais: Posicao[] = this.pecaService
      .verificarMovimentosDiagonal(posicao, cor, tabuleiro);

    let xeques: Posicao[] = [];
    if (movimentosDiagonais)
      for (let movimento of movimentosDiagonais){
        let pecaTabuleiro = tabuleiro[movimento.coluna][movimento.linha].peca;
        if (pecaTabuleiro instanceof Rainha || pecaTabuleiro instanceof Bispo)
          xeques.push(movimento)
      }
    return xeques;
      
  }

  verificarXequeRainhaTorre(posicao: Posicao, tabuleiro: Casa[][], cor: string): Posicao[]{
    let movimentosRetos: Posicao[] = this.pecaService
      .verificarMovimentosReto(posicao, cor, tabuleiro);

    let xeques: Posicao[] = [];
    if (movimentosRetos)  
      for (let movimento of movimentosRetos){
        let pecaTabuleiro = tabuleiro[movimento.coluna][movimento.linha].peca;
        if (pecaTabuleiro instanceof Rainha || pecaTabuleiro instanceof Torre)
          xeques.push(movimento)
      }
    return xeques;
      
  }

  verificarXequeCavalo(posicao: Posicao, tabuleiro: Casa[][], cor: string): Posicao[]{

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

    let xeques: Posicao[] = [];
    if (movimentosCavalo)      
      for (let movimento of movimentosCavalo){
        let pecaTabuleiro = tabuleiro[movimento.coluna][movimento.linha].peca;
        if (pecaTabuleiro instanceof Cavalo)
          xeques.push(movimento)
      }
    return xeques;  
  }

  verificarXequeRei(posicao: Posicao, tabuleiro: Casa[][], cor: string): Posicao[]{
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

    let xeques: Posicao[] = [];
    if (movimentosRei)     
      for (let movimento of movimentosRei){
        let pecaTabuleiro = tabuleiro[movimento.coluna][movimento.linha].peca;
        if (pecaTabuleiro instanceof Rei)
          xeques.push(movimento)
      }
    return xeques;
      
  }

  verificarXequePeao(posicao: Posicao, tabuleiro: Casa[][], cor: string): Posicao[]{
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
      .verificarMovimentosPeaoComer(acoesPossiveisPeao, cor, tabuleiro);
      
    let xeques: Posicao[] = [];
    if (movimentosPeao)   
      for (let movimento of movimentosPeao){
        let pecaTabuleiro = tabuleiro[movimento.coluna][movimento.linha].peca;
        if (pecaTabuleiro instanceof Peao)
          xeques.push(movimento)
      }     
    return xeques;    
  }
}
