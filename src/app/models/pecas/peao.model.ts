import { PecaService } from "../../services/peca.service";
import { Posicao } from "../posicao.model";
import { Peca } from "../peca.model";
import { Casa } from "../casa.model";
export class Peao extends Peca{  
    
    iniciando: boolean = true;
    promocao: boolean = false;
    posicaoEnPassant: Posicao | undefined;
    
    constructor(cor: string, private pecaService: PecaService) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]) {   
        let acoesMoverPossiveis: Posicao[] = [];
        let acoesComerPossiveis: Posicao[] = [];
        
        if (this.cor === "branco"){
            acoesMoverPossiveis.push(new Posicao(posicao.coluna - 1, posicao.linha))
            if (this.iniciando)
                acoesMoverPossiveis.push(new Posicao(posicao.coluna - 2, posicao.linha))

            acoesComerPossiveis.push(new Posicao(posicao.coluna - 1, posicao.linha - 1))
            acoesComerPossiveis.push(new Posicao(posicao.coluna - 1, posicao.linha + 1))
        }           
        else{
            acoesMoverPossiveis.push(new Posicao(posicao.coluna + 1, posicao.linha))
            if (this.iniciando)
                acoesMoverPossiveis.push(new Posicao(posicao.coluna + 2, posicao.linha)) 

            acoesComerPossiveis.push(new Posicao(posicao.coluna + 1, posicao.linha - 1))
            acoesComerPossiveis.push(new Posicao(posicao.coluna + 1, posicao.linha + 1))
        }   
        
        let acoesMover = this.pecaService.verificarMovimentosPeaoMover(acoesMoverPossiveis, cor, tabuleiro);
        let acoesComer = this.pecaService.verificarMovimentosPeaoComer(acoesComerPossiveis, cor, tabuleiro, this.posicaoEnPassant);
        this.posicaoEnPassant = undefined;

        this.acoes = [];
        if (acoesMover)
            this.acoes.push(...acoesMover)
        if (acoesComer)
            this.acoes.push(...acoesComer)

    }

}