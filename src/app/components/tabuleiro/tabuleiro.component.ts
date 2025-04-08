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
import { getAnimationData } from '../../move-animation.helper';
import { XequeRoqueService } from '../../services/xeque-roque.service';

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
    private xequeRoqueService: XequeRoqueService,
    private peaoService: PeaoService,
    private preparacaoService: PreparacaoService,
    private empateService: EmpateService
  ) {
    this.empateService.empatarObs.subscribe(data => {
      if (this.xequeService.isXequeMate() == false)
        this.empateEmit.emit(data)
    });

    this.empateService.opcaoEmpatarObs.subscribe(data => {
      this.empateOpcionalEmit.emit(data);
    })

    this.xequeService.xequeObs.subscribe(() => {
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
    await this.verificarMovimentos();
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

  async verificarMovimentos() {
    for (let colIndex = 0; colIndex <= 7; colIndex++) {
      for (let caIndex = 0; caIndex <= 7; caIndex++) {

        var casa = this.tabuleiroJogo[colIndex][caIndex];
        if (casa.peca)
        {
          if (casa.peca instanceof Peao)          
            this.peaoService.verificarEnPassantInicio(casa.peca);

          casa.peca.verMovimentosPossiveis(
            new Posicao(colIndex, caIndex),
            casa.peca.cor,
            this.tabuleiroJogo
          );
          
          this.verificarSegurancaAposMovimentos(
            casa.peca, 
            colIndex, 
            caIndex
          );
        }
      }
    }
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
    if (peca.cor == this.timeJogando && !this.jogoParado)
    {
      this.prepararParaMostrarAcoesPossiveis(peca, coluna, linha);

      for (let acao of peca.acoes) 
      {
        let acaoPecaSelecionada = this.tabuleiroJogo[acao.coluna][acao.linha];
        acaoPecaSelecionada.cor = 'LimeGreen';
        this.acoesPossiveis.push(acaoPecaSelecionada);
      }
    }
  }

  prepararParaMostrarAcoesPossiveis(peca: Peca, coluna: number, linha: number){
    this.resetAnimationState();
    this.casaSelecionada = this.tabuleiroJogo[coluna][linha];
    this.posicaoSelecionada = new Posicao(coluna, linha);
    this.verificarRoqueInicio(peca);
    this.apagarLocaisAnteriores();
  }

  moverPeca(casa: Casa, coluna: number, linha: number) {
    if (casa.cor === 'LimeGreen') 
    {
      let pecaComida = false;
      if (casa.peca != undefined) 
      {
        this.sendPecaCapturada(casa.peca);
        pecaComida = true;
      }

      this.casaSelecionada!.peca!.animationState = 'moved'
      casa.peca = this.casaSelecionada!.peca;
  
      this.prepararJogoAposMovimento(casa, coluna, linha, pecaComida)
    }
  }

  sendPecaCapturada(peca: Peca) {
    this.pecaCapturadaEmit.emit(peca);
  }

  prepararJogoAposMovimento(casa: Casa, coluna: number, linha: number, pecaComida: boolean){
    this.empateService.verificarTurnosSemMovimentarPeaoOuCapturar(pecaComida, casa.peca!.nome);
    this.apagarPecaPosicaoAnterior();
    this.apagarLocaisAnteriores();
    this.peaoService.verificarAcoesEspeciaisPeaoFinal(casa.peca!, coluna, linha, this.tabuleiroJogo);
    this.verificarRoqueFinal(casa.peca!);
    this.mudarTimeJogando();
    this.verificarXequePeca(casa.peca!, new Posicao(coluna, linha));
    this.empateService.verificarEmpate(this.tabuleiroJogo, this.timeJogando);
  }

  apagarPecaPosicaoAnterior(){
    let posicaoAnterior = 
    this.tabuleiroJogo[this.posicaoSelecionada!.coluna][
      this.posicaoSelecionada!.linha
      ]
  
    posicaoAnterior.peca = undefined;
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
    else 
      this.timeJogando = 'branco';
    this.verificarMovimentos();
  }

  getPosicaoRei(cor: string): Posicao | undefined {
    if (cor === 'branco') 
      return this.posicaoReiTimeBranco;
    else 
      return this.posicaoReiTimePreto;
  }

  setPosicaoRei(rei: Rei,  posicao: Posicao){
    if (rei.cor === 'branco') 
      this.posicaoReiTimeBranco = posicao;
    else 
      this.posicaoReiTimePreto = posicao;
  }

  verificarXequePeca(peca: Peca, posicao: Posicao) {
    if (peca instanceof Rei) 
      this.setPosicaoRei(peca, posicao)

    let posicaoRei = this.getPosicaoRei(this.timeJogando);

    this.xequeService.apagarLocalXeque();
    this.xequeService.verificarXeque(      
      posicaoRei!,
      this.timeJogando,
      this.tabuleiroJogo
    );
  }

  verificarRoqueInicio(peca: Peca) {
    this.posicaoRoque = this.xequeRoqueService.verificarRoqueInicio(peca, this.tabuleiroJogo);
  }

  verificarRoqueFinal(peca: Peca) {
    if (peca instanceof Torre || peca instanceof Rei) {
      this.posicaoRoque = '';
      if (peca.iniciando == true) 
        peca.iniciando = false;
    }
  }

  realizarRoque(posicaoRoque: string) {
    this.tabuleiroJogo = this.roqueService.realizarRoque(
      posicaoRoque,
      this.tabuleiroJogo,
      this.pecaService
    );
    this.posicaoRoque = '';
    this.prepararJogoAposRoque(posicaoRoque)
  }

  prepararJogoAposRoque(posicaoRoque: string){
    this.apagarLocaisAnteriores();
    this.mudarTimeJogando();
    this.roqueService.setPosicaoReiRoque(
      posicaoRoque, 
      this.posicaoReiTimeBranco, 
      this.posicaoReiTimePreto
    );
  }



  confirmarPecaPeaoPromovido($event: Peca) {
    this.peaoService.confirmarPecaPeaoPromovido($event, this.posicaoPromocao, this.tabuleiroJogo)
    
    let posicaoRei = this.getPosicaoRei(this.timeJogando);
    this.prepararJogoAposPeaoPromovido(posicaoRei!)    
  }

  prepararJogoAposPeaoPromovido(posicaoRei: Posicao){
    this.verificarMovimentos();
    this.xequeService.verificarXeque(      
      posicaoRei!,
      this.timeJogando,
      this.tabuleiroJogo
    );
    
    this.jogoParado = false;
    this.posicaoPromocao = undefined;
  }

  getAnimation(peca: Peca, coluna: number, linha: number) {
    if (!this.dragging)
      return getAnimationData(peca, this.posicaoSelecionada, coluna, linha)
    else 
      return '';
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
    this.posicaoRoque = "";
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
}
