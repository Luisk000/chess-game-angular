import { InitPeca } from "../init-peca.model";
export class Peao extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "peao"); 
    }
    
    override acao() {
        
    }

}