import { PecaService } from "../../services/peca.service";
import { Acao } from "../acao.model";
import { Peca } from "../peca.model";
export class Peao extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {   
        let acoesPossiveis;

        if (this.cor === "branco")
            acoesPossiveis = [
                new Acao(colunaInicio - 1, linhaInicio),   
                new Acao(colunaInicio - 2, linhaInicio),  
            ];
        else
            acoesPossiveis = [
                new Acao(colunaInicio + 1, linhaInicio),   
                new Acao(colunaInicio + 2, linhaInicio),  
            ];

        this.acoes = this.pecaService.verificarMovimentos(acoesPossiveis);
    }

}