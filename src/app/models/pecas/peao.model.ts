import { PecaService } from "../../services/peca.service";
import { Posicao } from "../posicao.model";
import { Peca } from "../peca.model";
import { Casa } from "../casa.model";
export class Peao extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {   
        let acoesPossiveis;
        if (this.cor === "branco")
            acoesPossiveis = [
                new Posicao(posicao.coluna - 1, posicao.linha),   
                new Posicao(posicao.coluna - 2, posicao.linha),  
            ];
        else
            acoesPossiveis = [
                new Posicao(posicao.coluna + 1, posicao.linha),   
                new Posicao(posicao.coluna + 2, posicao.linha),  
            ];

        this.acoes = this.pecaService.verificarMovimentos(acoesPossiveis, cor, tabuleiro);
    }

}