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
import { EmpateService } from '../../services/empate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
  animations: [move]
})
export class TabuleiroComponent implements OnInit {
  @Output() pecaCapturadaEmit = new EventEmitter<Peca>();
  @Output() timeJogandoEmit = new EventEmitter();
  @Output() xequeEmit = new EventEmitter();
  @Output() xequeMateEmit = new EventEmitter();
  @Output() empateEmit = new EventEmitter<string>();
  @Output() empateOpcionalEmit = new EventEmitter<{empateTextAtual: string, empateTextOpcional: string}>();

  tabuleiroJogo: Casa[][] = [];
  tabuleiroBackground: Casa[][] = [];
  acoesPossiveis: Casa[] = [];

  casaSelecionada: Casa | undefined;
  posicaoSelecionada: Posicao | undefined;

  posicaoReiTimeBranco: Posicao | undefined;
  posicaoReiTimePreto: Posicao | undefined;

  posicaoPromocao: Posicao | undefined;
  posicaoRoque = '';

  timeJogando = 'branco';
  jogoParado = false;

  casaDragging: Casa | undefined;
  dragging = false;

  constructor(
    private pecaService: PecaService,
    private xequeService: XequeService,
    private roqueService: RoqueService,
    private peaoService: PeaoService,
    private preparacaoService: PreparacaoService,
    private empateService: EmpateService
  ) {
    this.empateService.empatarObs.subscribe(data => {
      console.log("empate")
      if (this.xequeService.isXequeMate() == false)
        this.empateEmit.emit(data)
    });

    this.empateService.opcaoEmpatarObs.subscribe(data => {
      this.empateOpcionalEmit.emit(data);
    })

    this.xequeService.xequeObs.subscribe(() => {
      console.log("xeque")
      this.xequeEmit.emit();
    })

    this.xequeService.xequeMateObs.subscribe(() => {
      this.xequeMateEmit.emit();
      this.jogoParado = true;
    })

    this.peaoService.promocaoObs.subscribe(data => {
      this.posicaoPromocao = new Posicao(data.coluna, data.linha);
      this.jogoParado = true;
    })

    this.peaoService.enPassantObs.subscribe(data => {
      this.sendPecaCapturada(data);
    })
  }
  
  //#region all
  async ngOnInit() {
    await this.prepararTabuleiro();
    this.verificarMovimentos();
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
          if (casa.peca instanceof Peao)          
            this.peaoService.verificarEnPassantInicio(casa.peca);
          casa.peca.verMovimentosPossiveis(
            new Posicao(colunaIndex, casaIndex),
            casa.peca.cor,
            this.tabuleiroJogo
          );
          this.verificarSegurancaAposMovimentos(casa.peca, colunaIndex, casaIndex)     
        }
        
      });
    });
  }

  verificarSegurancaAposMovimentos(peca: Peca, coluna: number, linha: number){
    let posicaoRei = this.getPosicaoRei(peca.cor);

    this.xequeService.verificarSegurancaAposMovimentos(
      new Posicao(coluna, linha),
      peca,
      posicaoRei!,
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

      let pecaComida = false;
      if (casa.peca != undefined) {
        this.sendPecaCapturada(casa.peca);
        pecaComida = true;
      }

      this.casaSelecionada!.peca!.animationState = 'moved'
      casa.peca = this.casaSelecionada!.peca;

      this.empateService.verificarTurnosSemMovimentarPeaoOuCapturar(pecaComida, casa.peca!.nome);

      let posicaoAnterior = 
        this.tabuleiroJogo[this.posicaoSelecionada!.coluna][
          this.posicaoSelecionada!.linha
          ]
      
      posicaoAnterior.peca = undefined;

      this.apagarLocaisAnteriores();
      this.peaoService.verificarAcoesEspeciaisPeaoFinal(casa.peca!, coluna, linha, this.tabuleiroJogo);
      this.verificarRoqueFinal(casa.peca!);
      this.mudarTimeJogando();
      this.verificarXequePeca(casa.peca!, new Posicao(coluna, linha));
      this.empateService.verificarEmpate(this.tabuleiroJogo, this.timeJogando);
    }
  }

  sendPecaCapturada(peca: Peca) {
    this.pecaCapturadaEmit.emit(peca);
  }

  apagarLocaisAnteriores() {
    for (let casa of this.acoesPossiveis) {
      casa.cor = '';
      this.xequeService.manterXeques(casa);
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
    if (this.timeJogando === 'branco') 
      this.timeJogando = 'preto';
    else this.timeJogando = 'branco';
    this.verificarMovimentos();
  }

  getPosicaoRei(cor: string): Posicao | undefined {
    if (cor === 'branco') 
      return this.posicaoReiTimeBranco;
    else 
      return this.posicaoReiTimePreto;
  }

  async reiniciarPartida(){
    this.acoesPossiveis = [];
    this.xequeService.casaXeque = undefined;
    this.xequeService.xequeMate = false;
  
    this.timeJogando = 'branco';
    this.jogoParado = false;
     
    this.posicaoPromocao = undefined;
    this.peaoService.posicaoEnPassant = undefined;
    this.peaoService.timeEnPassant = '';

    this.empateService.statusTabuleiro = [];
    this.empateService.turnosSemCapturaEMovimentoPeao = 0;
  
    this.posicaoRoque = '';
  
    this.casaDragging = undefined;
    this.dragging = false;

    await this.prepararTabuleiro();
    this.verificarMovimentos();
  }

  verificarXequePeca(peca: Peca, posicao: Posicao) {
    if (peca instanceof Rei) {
      if (peca.cor === 'branco') 
        this.posicaoReiTimeBranco = posicao;
      else 
        this.posicaoReiTimePreto = posicao;
    }

    let posicaoRei = this.getPosicaoRei(this.timeJogando);

    this.xequeService.apagarLocalXeque();
    this.xequeService.verificarXeque(      
      posicaoRei!,
      this.timeJogando,
      this.tabuleiroJogo
    );
  }

  verificarRoqueInicio(peca: Peca) {
    if ((peca instanceof Torre || peca instanceof Rei) &&
      this.xequeService.casaXeque == undefined)
    {
      let posicaoRoque = this.roqueService.verificarPosicaoRoque(peca);
      if (posicaoRoque != "") {
        if (posicaoRoque === "preto" || posicaoRoque === "branco"){
          this.posicaoRoque = this.xequeService.verificarSegurancaAposRoqueDuplo(
            peca.cor, 
            posicaoRoque, 
            this.tabuleiroJogo
          );
        }
        else if (
          this.xequeService.verificarSegurancaAposRoque(
          peca.cor, 
          posicaoRoque, 
          this.tabuleiroJogo) == true
        )
          this.posicaoRoque = posicaoRoque;
      } 
    }
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
    switch (posicao){
      case 'branco-right':
        this.posicaoReiTimeBranco = new Posicao(7, 6);
        break;
      case 'preto-right':
        this.posicaoReiTimePreto = new Posicao(0, 6);
        break;
      case 'branco-left': 
        this.posicaoReiTimeBranco = new Posicao(7, 2);
        break;
      case 'preto-left':
        this.posicaoReiTimePreto = new Posicao(0, 2); 
        break;
    }
  }

  confirmarPecaPeaoPromovido($event: Peca) {
    let posicaoRei = this.getPosicaoRei(this.timeJogando);
    this.peaoService.confirmarPecaPeaoPromovido($event, this.posicaoPromocao, this.tabuleiroJogo)
        
    this.verificarMovimentos();
    this.xequeService.verificarXeque(      
      posicaoRei!,
      this.timeJogando,
      this.tabuleiroJogo
    );
    
    this.jogoParado = false;
    this.posicaoPromocao = undefined;
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
