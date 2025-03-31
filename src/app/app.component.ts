import { Component, ViewChild } from '@angular/core';
import { Peca } from './models/peca.model';
import { fade } from './animations';
import { TabuleiroComponent } from './components/tabuleiro/tabuleiro.component';
import { Rei } from './models/pecas/rei.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  animations: [fade]
})
export class AppComponent {

  pecasCapturadasJogador1: Peca[] = []
  pecasCapturadasJogador2: Peca[] = []

  jogador1Jogando = true;
  jogador2Jogando = false;

  xequeJogador1 = false;
  xequeJogador2 = false;

  vitoriaJogador1 = false;
  vitoriaJogador2 = false;

  empate = false;
  empatePopUp = false;
  empateTextOpcional = "";
  empateTextAtual = "";

  xeque = false;
  xequeMate = false;

  @ViewChild(TabuleiroComponent) tabuleiroComponent!: TabuleiroComponent;

  adicionarPecaCapturada(event: any){
    let peca: Peca = event;
    if (peca.cor === "branco")
      this.pecasCapturadasJogador2.push(peca);
    else
      this.pecasCapturadasJogador1.push(peca)

    if (peca instanceof Rei)
      console.log("Bug: Rei não está em jogo")
  }

  mudarTimeJogando(){
    this.jogador1Jogando = !this.jogador1Jogando;
    this.jogador2Jogando = !this.jogador2Jogando;

    this.xequeJogador1 = false;
    this.xequeJogador2 = false;

    this.empateTextOpcional = "";
    this.empateTextAtual = "";
  }

  mostrarXeque(){
    if (this.jogador1Jogando == true)
      this.xequeJogador1 = true;
    else
      this.xequeJogador2 = true;
    
      this.xeque = true;
      setTimeout(() => {
        this.xeque = false;
      }, 1000)
  }

  mostrarXequeMate(){
    if (this.jogador1Jogando == true){
      this.vitoriaJogador2 = true;
      this.jogador1Jogando = false;
    }
    else {
      this.vitoriaJogador1 = true;
      this.jogador2Jogando = false;
    }
    
      this.xequeMate = true;
      setTimeout(() => {
        this.xequeMate = false;
      }, 3000)
  }

  reiniciarPartida(){
    this.pecasCapturadasJogador1 = []
    this.pecasCapturadasJogador2 = []

    this.jogador1Jogando = true;
    this.jogador2Jogando = false;

    this.vitoriaJogador1 = false;
    this.vitoriaJogador2 = false;

    this.empate = false;
    this.empateTextAtual = "";
    this.empatePopUp = false;

    this.xequeMate = false;

    this.tabuleiroComponent.reiniciarPartida();
  }

  empatar($event: string){
    this.jogador1Jogando = false;
    this.jogador2Jogando = false;
    this.empateTextOpcional = "";
    this.empateTextAtual = $event;
    this.tabuleiroComponent.jogoParado = true;
    this.empate = true;
    this.empatePopUp = true;
    setTimeout(() => {
      this.empatePopUp = false;
    }, 3000)
  }

  mostrarOpcaoEmpatar($event: {empateTextAtual: string, empateTextOpcional: string}){
    this.empateTextAtual = $event.empateTextAtual
    this.empateTextOpcional = $event.empateTextOpcional;
  }
}
