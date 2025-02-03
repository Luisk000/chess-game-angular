import { PecaService } from "../../services/peca.service";
import { Peca } from "../peca.model";

export class Torre extends Peca{  
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "torre"); 
    }

    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = this.pecaService.verificarMovimentosReto(colunaInicio, linhaInicio)
    }

}