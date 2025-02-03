import { InitPeca } from "../init-peca.model";
export class Torre extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "torre"); 
    }

    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {


        

    }

}