import { EventEmitter, Injectable, Output } from '@angular/core';
import { Peca } from '../models/peca.model';
import { Casa } from '../models/casa.model';
import { Posicao } from '../models/posicao.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpateService {

  statusTabuleiro: string[] = [];
  turnosSemCapturaEMovimentoPeao = 0;

  private empatarSubject = new Subject<string>();
  private empateOpcionalSubject = new Subject<{empateTextAtual: string, empateTextOpcional: string}>();
  
  empatar = this.empatarSubject.asObservable();
  opcaoEmpatar = this.empateOpcionalSubject.asObservable();

  constructor() { }

  verificarEmpate(tabuleiroJogo: Casa[][], timeJogando: string){
      this.verificarEmpatePorInsuficiencia(tabuleiroJogo)
      this.verificarEmpatePorAfogamento(tabuleiroJogo, timeJogando)
      this.verificarEmpatePorRepeticao(tabuleiroJogo)
      this.verificarEmpatePor50acoes()
    }
  
    verificarEmpatePorInsuficiencia(tabuleiroJogo: Casa[][]){
      var casas = tabuleiroJogo.flat();
      
      var pecas: Peca[] = casas.map(c => c.peca!).filter(p => p && p.nome != 'rei')
      
      var pecasBrancas = pecas.filter(p => p.cor === "branco")
      var pecasPretas = pecas.filter(p => p.cor === "preto")
  
      if ((this.verificarInsuficiencia(pecasBrancas) &&
           this.verificarInsuficiencia(pecasPretas)) 
           ||
          (this.verificarInsuficienciaComDoisCavalos(pecasBrancas, pecasPretas) ||
           this.verificarInsuficienciaComDoisCavalos(pecasPretas, pecasBrancas))
        )
          this.empatarSubject.next("Empate por Insuficiência de Material")
  
    }
  
    verificarInsuficiencia(pecas: Peca[]){
      if (pecas.length == 0 || 
        (
          pecas.length == 1 &&
          (pecas[0].nome === "bispo" ||
           pecas[0].nome === "cavalo")
        )){
          return true
        }
  
      else
        return false
    }
  
    verificarInsuficienciaComDoisCavalos(pecasA: Peca[], pecasB: Peca[]){
      if ((pecasA.length == 0 &&
           pecasB.length == 2 &&
           pecasB[0].nome == "cavalo" && 
           pecasB[1].nome == "cavalo"
          ))
        return true
      else
        return false
    }
  
    verificarEmpatePorAfogamento(tabuleiroJogo: Casa[][], timeJogando: string){
      var casas: Casa[] = tabuleiroJogo.flat().filter(c => c.peca && c.peca.cor == timeJogando)
      var acoes: Posicao[] = casas.map(c => c.peca!).map(p => p.acoes).flat();
  
      if (acoes.length == 0)
        this.empatarSubject.next("Empate por Afogamento");  
    }
  
    verificarEmpatePorRepeticao(tabuleiroJogo: Casa[][]){
      this.montarStatusTabuleiro(tabuleiroJogo);
  
      if (this.statusTabuleiro.length >= 9)
        this.verificarRepeticao()
    }
  
    montarStatusTabuleiro(tabuleiroJogo: Casa[][]){
      let statusTabuleiro = "";
      for (let coluna of tabuleiroJogo){
        for (let casa of coluna){
          if (casa.peca)
            statusTabuleiro = statusTabuleiro + casa.peca.nome + casa.peca.cor + "."
          else
            statusTabuleiro = statusTabuleiro + "vazio."
        }
      }
      this.statusTabuleiro.push(statusTabuleiro)
    }
  
    verificarRepeticao(){
      let length = this.statusTabuleiro.length
      if (
        this.statusTabuleiro[length - 1] == this.statusTabuleiro[length - 5] &&
        this.statusTabuleiro[length - 5] == this.statusTabuleiro[length - 9]
      ){
        this.empateOpcionalSubject.next(
          {
            empateTextAtual: "Mesma posição repetida três vezes", 
            empateTextOpcional: "Empate por Tríplice Repetição"
          }
        );
      }
    }

    verificarTurnosSemMovimentarPeaoOuCapturar(pecaComida: boolean, nome: string){
      if (pecaComida == false && nome != 'peao')
        this.turnosSemCapturaEMovimentoPeao++
      else
        this.turnosSemCapturaEMovimentoPeao = 0;
    }

    verificarEmpatePor50acoes(){
      if (this.turnosSemCapturaEMovimentoPeao == 50)
        this.empateOpcionalSubject.next(
          {
            empateTextAtual: "50 lances sem movimentar um peão ou capturar uma peça", 
            empateTextOpcional: "Empate pela regra dos 50 lances"
          }
        );
      else if (this.turnosSemCapturaEMovimentoPeao == 75)
        this.empatarSubject.next("Empate pela regra dos 75 lances")
    }
}
