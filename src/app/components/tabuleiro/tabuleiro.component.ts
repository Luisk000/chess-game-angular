import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Casa } from '../../models/casa.model';
import { Peca } from '../../models/peca.model';
import { Peao } from '../../models/pecas/peao.model';
import { Rei } from '../../models/pecas/rei.model';
import { Torre } from '../../models/pecas/torre.model';
import { PecaService } from '../../services/peca.service';
import { Posicao } from '../../models/posicao.model';
import { XequeService } from '../../services/xeque.service';
import { PreparacaoService } from '../../services/preparacao.service';
import { move } from '../../animations';
import { RoqueService } from '../../services/roque.service';
import { PeaoService } from '../../services/peao.service';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
  animations: [move]
})
export class TabuleiroComponent implements OnInit {
  @Output() pecaComidaEmit = new EventEmitter<Peca>();
  @Output() timeJogandoEmit = new EventEmitter();
  @Output() xequeEmit = new EventEmitter();

  tabuleiroJogo: Casa[][] = [];
  tabuleiroBackground: Casa[][] = [];
  acoesPossiveis: Casa[] = [];
  casaXeque: Casa | undefined;

  casaSelecionada: Casa | undefined;
  posicaoSelecionada: Posicao | undefined;

  timeJogando = 'branco';
  jogoParado = false;
  primeiroTurno = true;

  posicaoReiTimeBranco: Posicao | undefined;
  posicaoReiTimePreto: Posicao | undefined;

  posicaoPromocao: Posicao | undefined;
  posicaoEnPassant: Posicao | undefined = undefined;
  timeEnPassant = '';

  posicaoRoque = '';

  casaDragging: Casa | undefined;
  dragging = false;

  constructor(
    private pecaService: PecaService,
    private xequeService: XequeService,
    private roqueService: RoqueService,
    private peaoService: PeaoService,
    private preparacaoService: PreparacaoService
  ) {}

  async ngOnInit() {
    await this.prepararTabuleiro();
    this.verificarMovimentos();
    this.primeiroTurno = false;
  }

  async prepararTabuleiro() {
    this.tabuleiroBackground =
      await this.preparacaoService.prepararTabuleiroBackground();

    this.tabuleiroJogo = await this.preparacaoService.prepararTabuleiroJogo(
      this.tabuleiroBackground,
      this.pecaService
    );

    this.posicaoReiTimeBranco = new Posicao(7, 4);
    this.posicaoReiTimePreto = new Posicao(0, 4);
  }

  verificarMovimentos() {
    this.tabuleiroJogo.map((coluna, colunaIndex) => {
      coluna.map((casa, casaIndex) => {
        if (casa.peca) {                 
          this.verificarEnPassantInicio(casa.peca);
          casa.peca.verMovimentosPossiveis(
            new Posicao(colunaIndex, casaIndex),
            casa.peca.cor,
            this.tabuleiroJogo
          );

          /* if (this.primeiroTurno == false)
            this.verificarSegurancaAposMovimentos(casa.peca, colunaIndex, casaIndex)  */     
        }
        
      });
    });
  }

  verificarSegurancaAposMovimentos(peca: Peca, coluna: number, linha: number){
    var posicaoRei: Posicao;
    if (peca.cor === 'branco')
      posicaoRei = this.posicaoReiTimeBranco!
    else
      posicaoRei = this.posicaoReiTimePreto!

    this.xequeService.verificarSegurancaAposMovimentos(
      new Posicao(coluna, linha),
      peca,
      posicaoRei,
      this.tabuleiroJogo
    )
  }

  mostrarAcoesPossiveis(peca: Peca, coluna: number, linha: number) {
    if (peca.cor == this.timeJogando && !this.jogoParado){

      this.resetAnimationState();
      this.casaSelecionada = this.tabuleiroJogo[coluna][linha];
      this.posicaoSelecionada = new Posicao(coluna, linha);

      this.verificarRoqueInicio(peca);
      this.apagarLocaisAnteriores();
  
      for (let acao of peca.acoes) {
        let acaoPecaSelecionada = this.tabuleiroJogo[acao.coluna][acao.linha];
  
        acaoPecaSelecionada.cor = 'LimeGreen';
        this.acoesPossiveis.push(acaoPecaSelecionada);
      }
    }
  }

  moverPeca(casa: Casa, coluna: number, linha: number) {
    if (casa.cor === 'LimeGreen') {
      if (casa.peca != undefined) this.sendPecaComida(casa.peca);


      this.casaSelecionada!.peca!.animationState = 'moved'
      casa.peca = this.casaSelecionada!.peca;

      this.tabuleiroJogo[this.posicaoSelecionada!.coluna][
        this.posicaoSelecionada!.linha
      ].peca = undefined;

      this.apagarLocaisAnteriores();
      this.verificarAcoesEspeciaisPeaoFinal(casa.peca!, coluna, linha);
      this.verificarRoqueFinal(casa.peca!);
      this.mudarTimeJogando();
      this.verificarXeque(casa.peca!, new Posicao(coluna, linha));
    }
  }

  sendPecaComida(peca: Peca) {
    this.pecaComidaEmit.emit(peca);
  }

  apagarLocaisAnteriores() {
    for (let casa of this.acoesPossiveis) {
      casa.cor = '';
      this.manterXeques(casa);
    }
    this.acoesPossiveis = [];
  }

  resetAnimationState(){
    this.tabuleiroJogo.map((coluna) => {
      coluna.map((casa) => {
        if (casa.peca)
          casa.peca.animationState = 'void'
        
      });
    });
  }

  mudarTimeJogando() {
    this.timeJogandoEmit.emit();
    if (this.timeJogando === 'branco') this.timeJogando = 'preto';
    else this.timeJogando = 'branco';
    this.verificarMovimentos();
  }

  //#region Xeque

  verificarXeque(peca: Peca, posicao: Posicao) {
    this.apagarLocalXeque();
    if (peca instanceof Rei) {
      if (peca.cor === 'branco') this.posicaoReiTimeBranco = posicao;
      else this.posicaoReiTimePreto = posicao;
    }

    let posicaoRei: Posicao | undefined;
    if (this.timeJogando === 'branco') posicaoRei = this.posicaoReiTimeBranco;
    else posicaoRei = this.posicaoReiTimePreto;

    let xeque: Posicao | undefined = this.xequeService.verificarXeque(
      this.timeJogando,
      posicaoRei!,
      this.tabuleiroJogo
    );

    if (xeque != undefined) {
      this.xequeEmit.emit();
      let casaXeque = this.tabuleiroJogo[xeque.coluna][xeque.linha];
      casaXeque.cor = 'red';
      this.casaXeque = casaXeque;
    }
  }

  apagarLocalXeque() {
    if (this.casaXeque){
      this.casaXeque.cor = '';
      this.casaXeque = undefined;
    }
  }

  manterXeques(casa: Casa) {
    if (this.casaXeque == casa)
      casa.cor = 'red';
  }

  //#endregion

  //#region Roque

  verificarRoqueInicio(peca: Peca) {
    if (
      (peca instanceof Torre || peca instanceof Rei) &&
      this.casaXeque == undefined
    )
      this.posicaoRoque = this.roqueService.verificarPosicaoRoque(peca);
    else this.posicaoRoque = '';
  }

  verificarRoqueFinal(peca: Peca) {
    if (peca instanceof Torre || peca instanceof Rei) {
      this.posicaoRoque = '';
      if (peca.iniciando == true) peca.iniciando = false;
    }
  }

  realizarRoque(posicaoRoque: string) {
    this.tabuleiroJogo = this.roqueService.realizarRoque(
      posicaoRoque,
      this.tabuleiroJogo,
      this.pecaService
    );
    this.posicaoRoque = '';
    this.apagarLocaisAnteriores();
    this.mudarTimeJogando();
    this.setPosicaoReiRoque(posicaoRoque);
  }

  setPosicaoReiRoque(posicao: string) {
    if (posicao == 'branco-right')
      this.posicaoReiTimeBranco = new Posicao(7, 6);
    else if (posicao == 'preto-right')
      this.posicaoReiTimeBranco = new Posicao(0, 6);

    if (posicao == 'branco-left') this.posicaoReiTimeBranco = new Posicao(7, 2);
    else if (posicao == 'preto-left')
      this.posicaoReiTimeBranco = new Posicao(0, 2);
  }

  //#endregion

  //#region Peão

  verificarAcoesEspeciaisPeaoFinal(peca: Peca, coluna: number, linha: number) {
    if (peca instanceof Peao) {
      if (peca.iniciando == true) {
        this.posicaoEnPassant = this.peaoService.verificarEnPassant(
          peca,
          coluna,
          linha
        );
        this.timeEnPassant = peca.cor;
        peca.iniciando = false;
      }
      this.realizarEnPassant(peca.cor, coluna, linha);
      this.realizarPromocao(peca, coluna, linha);
    }
  }

  realizarPromocao(peao: Peao, coluna: number, linha: number) {
    if (this.peaoService.verificarPromocao(peao, coluna)) {
      this.posicaoPromocao = new Posicao(coluna, linha);
      this.jogoParado = true;
    }
  }

  confirmarPecaPeaoPromovido($event: Peca) {
    if (this.posicaoPromocao) {
      let col = this.posicaoPromocao.coluna;
      let ca = this.posicaoPromocao.linha;
      this.tabuleiroJogo[col][ca].peca = $event;
      this.posicaoPromocao = undefined;
      this.jogoParado = false;
    }
  }

  verificarEnPassantInicio(peca: Peca) {
    if (peca instanceof Peao){
      if (this.timeEnPassant != peca.cor && 
        !peca.posicaoEnPassant
      )
        peca.posicaoEnPassant = this.posicaoEnPassant;
      else
        peca.posicaoEnPassant = undefined;     
    }
  }

  realizarEnPassant(cor: string, coluna: number, linha: number) {
    if (
      this.posicaoEnPassant &&
      coluna == this.posicaoEnPassant.coluna &&
      linha == this.posicaoEnPassant.linha
    ) {
      let pecaComida: Peca | undefined;

      if (cor == 'branco') {
        pecaComida = this.tabuleiroJogo[coluna + 1][linha].peca;
        this.tabuleiroJogo[coluna + 1][linha].peca = undefined;
      } else {
        pecaComida = this.tabuleiroJogo[coluna - 1][linha].peca;
        this.tabuleiroJogo[coluna - 1][linha].peca = undefined;
      }

      if (pecaComida) this.sendPecaComida(pecaComida);
    }
  }
  //#endregion

  //#region Dragging

  getIds() {
    return this.tabuleiroJogo
      .map((casa, col) =>
        this.tabuleiroJogo[col].map((casa, ca) => 'posicao' + col + ca)
      )
      .flat();
  }

  drop(event: any, coluna: number, linha: number) {
    this.casaDragging = undefined;
    this.moverPeca(event.container.data, coluna, linha);
  }

  enterCasa(event: any) {
    this.casaDragging = event.container.data;
  }

  exitCasa() {
    this.casaDragging = undefined;
  }

  startMovement() {
    this.dragging = true;
  }

  @HostListener('document:mouseup')
  draggingEnd() {
    if (this.dragging) {
      this.apagarLocaisAnteriores();
    }
    this.dragging = false;
  }

  //#endregion

  //#region Animation

  getXMovement(linha: number) {
    let valor = 0;
    if (this.posicaoSelecionada) 
      valor = this.posicaoSelecionada.linha - linha;
    return valor;
  }

  getYMovement(coluna: number) {
    let valor = 0;
    if (this.posicaoSelecionada)
      valor = this.posicaoSelecionada.coluna - coluna;
    return valor;
  }

  getAnimation(peca: Peca, coluna: number, linha: number) {
    if (!this.dragging)
      return {
        value: peca.animationState,
        params: {
          X: this.getXMovement(linha) * 70,
          Y: this.getYMovement(coluna) * 70,
        },
      };
    else return '';
  }

  //#endregion
}
