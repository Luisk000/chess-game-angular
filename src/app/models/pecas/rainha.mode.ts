import { InitPeca } from "../init-peca.model";
export class Rainha extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "rainha"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {


        

    }

}