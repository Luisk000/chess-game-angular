export interface Peca {
    imagem: string;
    nome: string;
    cor: string;
    vivo: boolean;
    acao(coluna: number, linha: number): { novaColuna: number; novaLinha: number; } | void;
}