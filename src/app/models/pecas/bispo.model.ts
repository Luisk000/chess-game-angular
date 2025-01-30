import { InitPeca } from "../init-peca.model";
export class Bispo extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "bispo"); 
    }
    
    override acao(coluna: number, linha: number) {
        
    }

}