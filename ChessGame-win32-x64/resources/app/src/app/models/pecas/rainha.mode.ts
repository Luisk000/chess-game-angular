import { PecaService } from "../../services/peca.service";
import { Casa } from "../casa.model";
import { Peca } from "../peca.model";
import { Posicao } from "../posicao.model";
export class Rainha extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "rainha"); 
    }
    
    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {       
        let movimentosDiagonais = this.pecaService.verificarMovimentosDiagonal(posicao, cor, tabuleiro);
        let movimentosRetos = this.pecaService.verificarMovimentosReto(posicao, cor, tabuleiro);

        this.acoes = [];
        if (movimentosDiagonais)
            this.acoes.push(...movimentosDiagonais)
        if (movimentosRetos)
            this.acoes.push(...movimentosRetos)
    }

}