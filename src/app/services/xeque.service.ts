import { Injectable } from '@angular/core';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Posicao } from '../models/posicao.model';

@Injectable({
  providedIn: 'root',
})
export class XequeService {
  constructor(private pecaService: PecaService) {}

  verificarXeque(cor: string, posicao: Posicao, tabuleiro: Casa[][]) {
    let xeques: Posicao[] = [];
    tabuleiro.map((coluna) => {
      coluna.map((casa) => {
        if (casa.peca && casa.peca.cor != cor){
          let xeque = casa.peca.acoes.filter(a => a.coluna == posicao.coluna && a.linha == posicao.linha);
          if (xeque.length > 0)
            xeques.push(xeque[0])
        }
        
      });
    });

    return xeques;
  }
}
