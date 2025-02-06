import { Component } from '@angular/core';
import { Peca } from './models/peca.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chess-game';
  pecasComidasJogador1: Peca[] = []
  pecasComidasJogador2: Peca[] = []
  jogador1Jogando = true;
  jogador2Jogando = false;

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
  }
}
