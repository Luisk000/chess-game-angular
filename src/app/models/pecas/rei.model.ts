import { PecaService } from "../../services/peca.service";
import { Acao } from "../acao.model";
import { Peca } from "../peca.model";
export class Rei extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "rei"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        let acoesPossiveis = [
            new Acao(colunaInicio + 1, linhaInicio),   
            new Acao(colunaInicio - 1, linhaInicio), 
            new Acao(colunaInicio, linhaInicio + 1), 
            new Acao(colunaInicio, linhaInicio - 1),  
        ];

        this.acoes = this.pecaService.verificarMovimentos(acoesPossiveis);
    }

}