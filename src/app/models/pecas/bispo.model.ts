import { InitPeca } from "../init-peca.model";
export class Bispo extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "bispo"); 
    }
    

    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        
        let coluna = colunaInicio--;
        let linha = linhaInicio--;
        for (;coluna >= 0 && linha >= 0;){
            this.adicionarMovimentoPossivel(coluna, linha);
            coluna--;
            linha--;
        }

        coluna = colunaInicio--;
        linha = linhaInicio++;
        for (;coluna >= 0 && linha <= 7;){
            this.adicionarMovimentoPossivel(coluna, linha);
            coluna--;
            linha++;
        }

        coluna = colunaInicio++;
        linha = linhaInicio--;
        for (;coluna <= 7 && linha >= 0;){
            this.adicionarMovimentoPossivel(coluna, linha);
            coluna++;
            linha--;
        }

        coluna = colunaInicio++;
        linha = linhaInicio++;
        for (;coluna <= 7 && linha <= 7;){
            this.adicionarMovimentoPossivel(coluna, linha);
            coluna++;
            linha++;
        }
    }

 
}