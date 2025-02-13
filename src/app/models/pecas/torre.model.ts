import { PecaService } from "../../services/peca.service";
import { Casa } from "../casa.model";
import { Peca } from "../peca.model";
import { Posicao } from "../posicao.model";

export class Torre extends Peca{  

    iniciando: boolean = true;
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "torre"); 
    }

    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {
        this.acoes = this.pecaService.verificarMovimentosReto(posicao, cor, tabuleiro)
    }

}