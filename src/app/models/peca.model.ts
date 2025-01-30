export interface Peca {
    imagem: string;
    nome: string;
    cor: string;
    vivo: boolean;
    verificarAcoes(colunaInicio: number, linhaInicio: number): { colunaPossivel: number; linhaPossivel: number; }[] | void;
}