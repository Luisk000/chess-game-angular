import { InitPeca } from "../init-peca.model";
export class Rei extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "rei"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {




    }

}