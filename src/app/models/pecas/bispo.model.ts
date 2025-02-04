import { PecaService } from "../../services/peca.service";
import { Casa } from "../casa.model";
import { Peca } from "../peca.model";
import { Posicao } from "../posicao.model";
export class Bispo extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "bispo"); 
    }
    
    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {
        this.acoes = this.pecaService.verificarMovimentosDiagonal(posicao, cor, tabuleiro)
    }

 
}