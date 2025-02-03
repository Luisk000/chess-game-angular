export interface Peca {
    imagem: string;
    nome: string;
    cor: string;
    vivo: boolean;
    verMovimentosPossiveis(colunaInicio: number, linhaInicio: number): void;
}