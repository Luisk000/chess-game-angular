import { PecaService } from "../../services/peca.service";
import { Acao } from "../acao.model";
import { Peca } from "../peca.model";
export class Cavalo extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "cavalo"); 
    }  
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        let acoesPossiveis = [
            new Acao(colunaInicio - 1, linhaInicio+2),   
            new Acao(colunaInicio - 1, linhaInicio-2), 
            new Acao(colunaInicio + 1, linhaInicio+2), 
            new Acao(colunaInicio + 1, linhaInicio-2),  
            new Acao(colunaInicio-2, linhaInicio + 1),   
            new Acao(colunaInicio-2, linhaInicio - 1), 
            new Acao(colunaInicio+2, linhaInicio + 1), 
            new Acao(colunaInicio+2, linhaInicio - 1),  
        ];
        
        this.acoes = this.pecaService.verificarMovimentos(acoesPossiveis);
    }

}