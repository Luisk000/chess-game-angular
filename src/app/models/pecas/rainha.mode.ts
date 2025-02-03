import { PecaService } from "../../services/peca.service";
import { Peca } from "../peca.model";
export class Rainha extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "rainha"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {       
        let movimentosDiagonais = this.pecaService.verificarMovimentosDiagonal(colunaInicio, linhaInicio);
        let movimentosRetos = this.pecaService.verificarMovimentosReto(colunaInicio, linhaInicio);

        this.acoes = [];
        if (movimentosDiagonais)
            this.acoes.push(...movimentosDiagonais)
        if (movimentosRetos)
            this.acoes.push(...movimentosRetos)
    }

}