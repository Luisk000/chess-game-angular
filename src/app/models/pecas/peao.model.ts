import { InitPeca } from "../init-peca.model";
export class Peao extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "peao"); 
    }
    
    override verificarAcoes(colunaInicio: number, linhaInicio: number) {
        let acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];
        let movimentoColuna = this.cor === "branco" ? -1 : 1;

        if (colunaInicio + movimentoColuna > 0){
            if (linhaInicio - 1 > 0)
            {
                acoes.push({ 
                    colunaPossivel: colunaInicio + movimentoColuna, 
                    linhaPossivel: linhaInicio - 1 
                });
            }
            if (linhaInicio + 1 < 8)
            {
                acoes.push({ 
                    colunaPossivel: colunaInicio + movimentoColuna, 
                    linhaPossivel: linhaInicio + 1 
                });
            }
        }   
        return acoes;
    }

}