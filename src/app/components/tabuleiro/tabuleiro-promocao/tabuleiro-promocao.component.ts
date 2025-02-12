import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Cavalo } from '../../../models/pecas/cavalo.model';
import { Rainha } from '../../../models/pecas/rainha.mode';
import { Bispo } from '../../../models/pecas/bispo.model';
import { Torre } from '../../../models/pecas/torre.model';
import { PecaService } from '../../../services/peca.service';
import { Peca } from '../../../models/peca.model';

@Component({
  selector: 'app-tabuleiro-promocao',
  standalone: false,
  
  templateUrl: './tabuleiro-promocao.component.html',
  styleUrl: './tabuleiro-promocao.component.css'
})
export class TabuleiroPromocaoComponent implements OnChanges{

  @Input() time = "";
  @Input() linha: number | undefined = undefined;
  @Output() confirmarPeca = new EventEmitter<Peca>();
  rainha?: Rainha = undefined;
  cavalo?: Cavalo = undefined;
  bispo?: Bispo = undefined;
  torre?: Torre = undefined;

  constructor(private pecaService: PecaService){ }

  ngOnChanges() {
    if (this.time != ""){
      this.rainha = new Rainha(this.time, this.pecaService)
      this.cavalo = new Cavalo(this.time, this.pecaService)
      this.bispo = new Bispo(this.time, this.pecaService)
      this.torre = new Torre(this.time, this.pecaService)
    }
  }

  escolherPeca(peca: Peca | undefined){
    if (peca)
      this.confirmarPeca.emit(peca);
    this.time = "";
  }
}
