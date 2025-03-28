import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Peca } from '../../models/peca.model';

@Component({
  selector: 'app-painel',
  standalone: false,
  
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent implements OnInit, OnChanges {

  title = "";

  @Input() time = ""
  @Input() jogando = false;
  @Input() pecasComidas: Peca[] = [];
  @Input() xeque = false;
  @Input() vitoria = false;
  @Input() derrota = false;
  @Input() empate = "";
  rodada = 0;

  @Output() reiniciarPartida = new EventEmitter();

  ngOnInit() {
    if (this.time == "branco")
      this.title = "JOGADOR 1";
    else
      this.title = "JOGADOR 2";
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['empate'] && changes['empate'].currentValue === "")
      this.rodada = 0;   
    
    if (changes['jogando'] && changes['jogando'].currentValue == true) 
      this.rodada++;
  }

  jogarNovamente(){
    this.reiniciarPartida.emit();
  }
}
