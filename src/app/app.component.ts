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

  pecasComidasJogador1: Peca[] = []
  pecasComidasJogador2: Peca[] = []

  jogador1Jogando = true;
  jogador2Jogando = false;

  xequeJogador1 = false;
  xequeJogador2 = false;

  vitoriaJogador1 = false;
  vitoriaJogador2 = false;

  empate = false;
  empateText = "";

  xeque = false;
  xequeMate = false;

  @ViewChild(TabuleiroComponent) tabuleiroComponent!: TabuleiroComponent;

  adicionarPecaComida(event: any){
    let peca: Peca = event;
    if (peca.cor === "branco")
      this.pecasComidasJogador2.push(peca);
    else
      this.pecasComidasJogador1.push(peca)

    if (peca instanceof Rei)
      console.log("Bug: Rei não está em jogo")
    
    this.verificarEmpatePorApenasDoisReis();
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
    this.pecasComidasJogador1 = []
    this.pecasComidasJogador2 = []

    this.jogador1Jogando = true;
    this.jogador2Jogando = false;

    this.vitoriaJogador1 = false;
    this.vitoriaJogador2 = false;

    this.empate = false;
    this.empateText = "";

    this.xequeMate = false;

    this.tabuleiroComponent.reiniciarPartida();
  }

  verificarEmpatePorApenasDoisReis(){
    if (this.pecasComidasJogador1.length == 15 &&
      this.pecasComidasJogador2.length == 15
    ){
      this.empatar("Empate por Insuficiência");
    }
  }

  empatePorAfogamento(){
    this.empatar("Empate por Afogamento");
  }

  empatar(text: string){
    this.jogador1Jogando = false;
    this.jogador2Jogando = false;
    this.empateText = text;
    this.tabuleiroComponent.jogoParado = true;
    this.empate = true;
    setTimeout(() => {
      this.empate = false;
    }, 3000)
  }
}
