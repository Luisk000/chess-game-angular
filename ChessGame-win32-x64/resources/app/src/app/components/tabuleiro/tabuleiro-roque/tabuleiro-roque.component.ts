import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabuleiro-roque',
  standalone: false,
  
  templateUrl: './tabuleiro-roque.component.html',
  styleUrl: './tabuleiro-roque.component.css'
})
export class TabuleiroRoqueComponent {
  @Input() marginTop = 0;
  @Input() marginLeft = 0;
  @Input() width = 0;
}
