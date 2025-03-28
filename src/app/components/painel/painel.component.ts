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
  @Input() rodada: number = 0;
  @Input() xeque = false;
  @Input() vitoria = false;
  @Input() derrota = false;
  @Input() empate = false;

  @Output() reiniciarPartida = new EventEmitter();

  ngOnInit() {
    if (this.time == "branco")
      this.title = "JOGADOR 1";
    else
      this.title = "JOGADOR 2";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jogando'] && changes['jogando'].currentValue === true) {
      this.rodada++;
    }
  }

  jogarNovamente(){
    this.rodada = 0;
    this.vitoria = false;
    this.derrota = false;
    this.empate = false;

    this.reiniciarPartida.emit();
  }
}
