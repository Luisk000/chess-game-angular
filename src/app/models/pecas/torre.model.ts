import { PecaService } from "../../services/peca.service";
import { Casa } from "../casa.model";
import { Peca } from "../peca.model";
import { Posicao } from "../posicao.model";

export class Torre extends Peca{  

    iniciando: boolean = true;
    roquePequeno = false;
    roqueGrande = false;
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "torre"); 
    }

    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {
        this.acoes = this.pecaService.verificarMovimentosReto(posicao, cor, tabuleiro)

        if (this.iniciando == true && this.roquePequeno == false)
            this.roquePequeno = this.pecaService.verificarRoquePequeno(cor, tabuleiro);
        
        else if (this.iniciando == true && this.roqueGrande == false)
            this.roqueGrande = this.pecaService.verificarRoqueGrande(cor, tabuleiro);
    }

}