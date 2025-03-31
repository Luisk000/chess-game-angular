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
  rodada = 0;

  @Input() time = ""
  @Input() jogando = false;
  @Input() pecasComidas: Peca[] = [];
  @Input() xeque = false;
  @Input() vitoria = false;
  @Input() derrota = false;
  @Input() empate = false;
  @Input() empateText = "";
  @Input() opcaoEmpatar = false;

  @Output() reiniciarPartida = new EventEmitter();
  @Output() empatarEmit = new EventEmitter<string>();

  ngOnInit() {
    if (this.time == "branco")
      this.title = "JOGADOR 1";
    else
      this.title = "JOGADOR 2";
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['empate'] && changes['empate'].currentValue == false)
      this.rodada = 0;   
    
    if (changes['jogando'] && changes['jogando'].currentValue == true) 
      this.rodada++;
  }

  jogarNovamente(){
    this.reiniciarPartida.emit();
  }

  pedirEmpate(){
    this.empatarEmit.emit("Empate por Tríplice Repetição");
  }
}
