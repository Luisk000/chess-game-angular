export abstract class Peca {
    nome : string;
    cor: string;
    imagem : string;
    vivo = true;
    acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];

    constructor(cor: string, nome:string){
        this.cor = cor;
        this.nome = nome;
        this.imagem = `assets/${this.nome}_${this.cor}.png`;
    }

    verificarEAdicionarMovimentoUnico(colunaPossivel: number, linhaPossivel: number) {
        if (colunaPossivel >= 0 && colunaPossivel <= 7 && 
            linhaPossivel >= 0 && linhaPossivel <= 7
        )
        this.adicionarMovimentoUnico(colunaPossivel, linhaPossivel);
    };

    adicionarMovimentoUnico(colunaPossivel: number, linhaPossivel: number) {
        this.acoes.push({ 
            colunaPossivel: colunaPossivel, 
            linhaPossivel: linhaPossivel
        });
    };

    verificarMovimentosDiagonais(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        
        let coluna = colunaInicio - 1;
        let linha = linhaInicio - 1;
        while (coluna >= 0 && linha >= 0){
            this.adicionarMovimentoUnico(coluna, linha);
            coluna - 1;
            linha - 1;
        }

        coluna = colunaInicio - 1;
        linha = linhaInicio + 1;
        while (coluna >= 0 && linha <= 7){
            this.adicionarMovimentoUnico(coluna, linha);
            coluna - 1;
            linha + 1;
        }

        coluna = colunaInicio + 1;
        linha = linhaInicio - 1;
        while (coluna <= 7 && linha >= 0){
            this.adicionarMovimentoUnico(coluna, linha);
            coluna + 1;
            linha - 1;
        }

        coluna = colunaInicio + 1;
        linha = linhaInicio + 1;
        while (coluna <= 7 && linha <= 7){
            this.adicionarMovimentoUnico(coluna, linha);
            coluna + 1;
            linha + 1;
        }
    }

    verificarMovimentosRetos(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        
        let coluna = colunaInicio - 1;
        while (coluna >= 0){
            this.adicionarMovimentoUnico(coluna, linhaInicio);
            coluna - 1;
        }

        coluna = colunaInicio + 1;
        while (coluna <= 7){
            this.adicionarMovimentoUnico(coluna, linhaInicio);
            coluna - 1;
        }

        let linha = linhaInicio - 1;
        while (linha >= 0){
            this.adicionarMovimentoUnico(colunaInicio, linha);
            linha - 1;
        }

        linha = linhaInicio + 1;
        while (linha <= 7){
            this.adicionarMovimentoUnico(colunaInicio, linha);
            coluna + 1;
            linha + 1;
        }
    }

    verMovimentosPossiveis(colunaInicio: number, linhaInicio: number): void {}
}

