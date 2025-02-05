import { PecaService } from "../../services/peca.service";
import { Posicao } from "../posicao.model";
import { Peca } from "../peca.model";
import { Casa } from "../casa.model";
export class Rei extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "rei"); 
    }
    
    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {
        let acoesPossiveis = [
            new Posicao(posicao.coluna + 1, posicao.linha),   
            new Posicao(posicao.coluna - 1, posicao.linha), 
            new Posicao(posicao.coluna, posicao.linha + 1), 
            new Posicao(posicao.coluna, posicao.linha - 1),  
            new Posicao(posicao.coluna + 1, posicao.linha + 1),   
            new Posicao(posicao.coluna - 1, posicao.linha - 1), 
            new Posicao(posicao.coluna + 1, posicao.linha - 1), 
            new Posicao(posicao.coluna - 1, posicao.linha + 1),  
        ];

        this.acoes = this.pecaService.verificarMovimentos(acoesPossiveis, cor, tabuleiro);
    }

}