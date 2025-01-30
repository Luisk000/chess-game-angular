import { InitPeca } from "../init-peca.model";
export class Rei extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "rei"); 
    }
    
    override verificarAcoes(colunaInicio: number, linhaInicio: number) {
        let acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];
        let movimentoColuna = this.cor === "branco" ? -1 : 1;
    }

}