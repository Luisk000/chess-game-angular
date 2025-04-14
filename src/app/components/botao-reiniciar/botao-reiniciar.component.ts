import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-botao-reiniciar',
  standalone: false,
  
  templateUrl: './botao-reiniciar.component.html',
  styleUrl: './botao-reiniciar.component.css'
})
export class BotaoReiniciarComponent {

  @Output() reiniciarEmit = new EventEmitter();

  reiniciarPartida(){
    this.reiniciarEmit.emit();
  }
}
