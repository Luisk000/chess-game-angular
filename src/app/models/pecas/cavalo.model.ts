import { InitPeca } from "../init-peca.model";
export class Cavalo extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "cavalo"); 
    }  
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {

        //top

        //bottom

        //left

        //right
        
    }

    verMovimentoPossivel(coluna: number, linha: number){

    }

}