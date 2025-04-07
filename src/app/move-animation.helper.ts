import { Peca } from "./models/peca.model";
import { Posicao } from "./models/posicao.model";

export function getAnimationData(
    peca: Peca,
    posicaoSelecionada: Posicao | undefined,
    coluna: number,
    linha: number
){
    const getXMovement = () => {
        let valor = 0;
        if (posicaoSelecionada) 
            valor = posicaoSelecionada.linha - linha;
        return valor;
    }

    const getYMovement = () => {
        let valor = 0;
        if (posicaoSelecionada) 
            valor = posicaoSelecionada.coluna - coluna;
        return valor;
    }

    return {
        value: peca.animationState,
        params: {
            X: getXMovement() * 70,
            Y: getYMovement() * 70,
        },          
    }
}