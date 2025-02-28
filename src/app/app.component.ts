import { Component } from '@angular/core';
import { Peca } from './models/peca.model';
import { fade } from './animations';

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

  popUpXeque = false;

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
    
    this.popUpText();
  }

  popUpText(){
    this.popUpXeque = true;
    setTimeout(() => {
      this.popUpXeque = false;
    }, 1000)
  }
}
