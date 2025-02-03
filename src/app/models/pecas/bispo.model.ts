import { PecaService } from "../../services/peca.service";
import { Peca } from "../peca.model";
export class Bispo extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "bispo"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = this.pecaService.verificarMovimentosDiagonal(colunaInicio, linhaInicio)
    }

 
}