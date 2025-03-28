import { Component, ViewChild } from '@angular/core';
import { Peca } from './models/peca.model';
import { fade } from './animations';
import { TabuleiroComponent } from './components/tabuleiro/tabuleiro.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  animations: [fade]
})
export class AppComponent {
  title = 'chess-game';
  pecasComidasJogador1: Peca[] = []
  pecasComidasJogador2: Peca[] = []

  jogador1Jogando = true;
  jogador2Jogando = false;

  xequeJogador1 = false;
  xequeJogador2 = false;

  vitoriaJogador1 = false;
  vitoriaJogador2 = false;

  popUpXeque = false;
  popUpXequeMate = false;

  @ViewChild(TabuleiroComponent) tabuleiroComponent!: TabuleiroComponent;

  adicionarPecaComida(event: any){
    let peca: Peca = event
    if (peca.cor === "branco")
      this.pecasComidasJogador2.push(peca);
    else
      this.pecasComidasJogador1.push(peca)
  }

  mudarTimeJogando(){
    this.jogador1Jogando = !this.jogador1Jogando;
    this.jogador2Jogando = !this.jogador2Jogando;

    this.xequeJogador1 = false;
    this.xequeJogador2 = false;
  }

  mostrarXeque(){
    if (this.jogador1Jogando == true)
      this.xequeJogador1 = true;
    else
      this.xequeJogador2 = true;
    
      this.popUpXeque = true;
      setTimeout(() => {
        this.popUpXeque = false;
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
    
      this.popUpXequeMate = true;
      setTimeout(() => {
        this.popUpXequeMate = false;
      }, 3000)
  }

  reiniciarPartida(){
    this.pecasComidasJogador1 = []
    this.pecasComidasJogador2 = []

    this.jogador1Jogando = true;
    this.jogador2Jogando = false;

    this.vitoriaJogador1 = false;
    this.vitoriaJogador2 = false;

    this.popUpXequeMate = false;

    this.tabuleiroComponent.reiniciarPartida();
  }
}
