import { Injectable } from '@angular/core';
import { Casa } from '../models/casa.model';
import { PecaService } from './peca.service';
import { Posicao } from '../models/posicao.model';
import { Peca } from '../models/peca.model';

@Injectable({
  providedIn: 'root',
})
export class XequeService {
  constructor() {}

  //retornar as posições ao invés de retornar boolean

  verificarXeque(cor: string, posicaoRei: Posicao, tabuleiro: Casa[][]) {
    let xeques: Posicao[] = [];
    tabuleiro.map((coluna) => {
      coluna.map((casa) => {
        if (casa.peca && casa.peca.cor != cor){
          let xeque = this.findPosicao(posicaoRei, casa.peca.acoes)
          if (xeque != undefined)
            xeques.push(xeque)
        }
        
      });
    });

    return xeques;
  }

  private verificarXequeProximoTurno(cor: string, posicaoRei: Posicao, tabuleiro: Casa[][]){
    let haXeque = false;
    tabuleiro.map((coluna) => {
      coluna.map((casa) => {
        if (casa.peca && casa.peca.cor != cor){
          let xeque = this.findPosicao(posicaoRei, casa.peca.acoes)
          if (xeque != undefined)
            haXeque = true;
        }
        
      });
    });

    return haXeque;
  }

  verificarSegurancaAposMovimento(posicaoAntiga: Posicao, posicaoNova: Posicao, pecaNova: Peca, posicaoRei: Posicao, tabuleiro: Casa[][]){    
    var tabuleiroHipotetico = JSON.parse(JSON.stringify(tabuleiro));
    
    tabuleiroHipotetico[posicaoAntiga.coluna][posicaoAntiga.linha].peca = undefined;
    tabuleiroHipotetico[posicaoNova.coluna][posicaoNova.linha].peca = pecaNova;

    if (this.verificarXequeProximoTurno(pecaNova.cor, posicaoRei, tabuleiro) == true)
      return false
    else
      return true;
  }

  verificarSegurancaAposMoverRei(posicaoAntiga: Posicao, posicaoNova: Posicao, pecaNova: Peca, tabuleiro: Casa[][]){    
    var tabuleiroHipotetico = JSON.parse(JSON.stringify(tabuleiro));
    
    tabuleiroHipotetico[posicaoAntiga.coluna][posicaoAntiga.linha].peca = undefined;
    tabuleiroHipotetico[posicaoNova.coluna][posicaoNova.linha].peca = pecaNova;

    if (this.verificarXequeProximoTurno(pecaNova.cor, posicaoNova, tabuleiro) == true)
      return false
    else
      return true;
  }

  private escaparXequeComendo(posicaoXeque: Posicao, posicaoRei: Posicao, cor: string, tabuleiro: Casa[][]){
    var podeEscapar = false;
    tabuleiro.map((coluna, colunaIndex) => {
      coluna.map((casa, casaIndex) => {        
        if (casa.peca){
          let posicaoEscaparXeque = this.findPosicao(posicaoXeque, casa.peca.acoes)
          if (casa.peca && casa.peca.cor != cor && 
            posicaoEscaparXeque != undefined
          )
            podeEscapar = this.verificarSegurancaAposMovimento(
              new Posicao(colunaIndex, casaIndex),
              new Posicao(posicaoEscaparXeque.coluna, posicaoEscaparXeque.linha),
              casa.peca,
              posicaoRei,
              tabuleiro
            );
        }       
      })
    })
    return podeEscapar;
  }

  private escaparXequeBloqueando(posicaoXeque: Posicao, posicaoRei: Posicao, tabuleiro: Casa[][]){
    var podeEscapar = true;
    tabuleiro.map((coluna) => {
      coluna.map((casa) => {
        //posicao[ 0, 8 ]
        //posicao[ 3, 5 ]
        //get the positions between the two
      })
    })
    return podeEscapar;
  }

  private escaparXequeMovendoRei(posicaoXeque: Posicao, posicaoRei: Posicao, cor: string, tabuleiro: Casa[][]){
    var rei: Peca = tabuleiro[posicaoRei.coluna][posicaoRei.linha].peca!;

    var podeEscapar = true;
    rei.acoes.map((acao) => {
      podeEscapar = this.verificarSegurancaAposMoverRei(
        posicaoRei,
        acao,
        rei,
        tabuleiro
      )
    })
    return podeEscapar;
  }

  private findPosicao(posicao: Posicao, posicoes: Posicao[]){
    return posicoes.find(a => a.coluna == posicao.coluna && a.linha == posicao.linha)
  }
}
