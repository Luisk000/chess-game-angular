import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { Peca } from '../../models/peca.model';
import { Peao } from '../../models/pecas/peao.model';
import { Rei } from '../../models/pecas/rei.model';
import { Torre } from '../../models/pecas/torre.model';
import { PecaService } from '../../services/peca.service';
import { Posicao } from '../../models/posicao.model';
import { TabuleiroService } from '../../services/tabuleiro.service';
import { XequeService } from '../../services/xeque.service';
import { PreparacaoService } from '../../services/preparacao.service';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
})
export class TabuleiroComponent implements OnInit {
  @Output() pecaComidaEmit = new EventEmitter<Peca>();
  @Output() timeJogandoEmit = new EventEmitter();

  tabuleiroJogo: Casa[][] = [];
  tabuleiroBackground: Casa[][] = [];
  acoesPossiveis: Casa[] = [];

  casaSelecionada: Casa | undefined;
  posicaoSelecionada: Posicao | undefined;

  timeJogando = 'branco';
  jogoParado = false;

  posicaoReiTimeBranco: Posicao | undefined;
  posicaoReiTimePreto: Posicao | undefined;

  posicaoPromocao: Posicao | undefined;
  posicaoEnPassant: Posicao | undefined = undefined;
  timeEnPassant = "";
  
  posicaoRoque = "";

  constructor(
    private pecaService: PecaService,
    private tabuleiroService: TabuleiroService,
    private xequeService: XequeService,
    private preparacaoService: PreparacaoService
  ) {}

  async ngOnInit() {
    await this.prepararTabuleiro();
  }

  async prepararTabuleiro(){
    this.tabuleiroBackground = await this.preparacaoService
      .prepararTabuleiroBackground();

    this.tabuleiroJogo = await this.preparacaoService
      .prepararTabuleiroJogo(this.tabuleiroBackground, this.pecaService);

    this.posicaoReiTimeBranco = new Posicao(7, 4);
    this.posicaoReiTimePreto = new Posicao(0, 4);
  }

  verificarMovimentos(peca: Peca, coluna: number, linha: number) {
    if (peca.cor === this.timeJogando && !this.jogoParado) {
      this.casaSelecionada = this.tabuleiroJogo[coluna][linha];
      this.posicaoSelecionada = new Posicao(coluna, linha);

      this.verificarEnPassantInicio(peca);    

      peca.verMovimentosPossiveis(
        this.posicaoSelecionada,
        peca.cor,
        this.tabuleiroJogo
      );

      this.verificarRoqueInicio(peca)
      this.mostrarAcoesPossiveis(peca);             
    }
  }
  
  mostrarAcoesPossiveis(peca: Peca){
    this.apagarLocaisAnteriores();

    for (let acao of peca.acoes) {
      let acaoPecaSelecionada =
        this.tabuleiroJogo[acao.coluna][acao.linha];

      acaoPecaSelecionada.cor = 'LimeGreen';
      this.acoesPossiveis.push(acaoPecaSelecionada);
    }
  }

  moverPeca(casa: Casa, coluna: number, linha: number) {
    if (casa.cor === 'LimeGreen') {
      
      if (casa.peca != undefined) 
        this.sendPecaComida(casa.peca);

      casa.peca = this.casaSelecionada?.peca;

      this.tabuleiroJogo
        [this.posicaoSelecionada!.coluna]
        [this.posicaoSelecionada!.linha]
        .peca = undefined;

      this.apagarLocaisAnteriores();     
      this.mudarTimeJogando();   

      this.verificarAcoesEspeciaisPeaoFinal(casa.peca!, coluna, linha);
      this.verificarRoqueFinal(casa.peca!);
      this.verificarXeque(casa.peca!, new Posicao(coluna, linha));
    }
  }

  sendPecaComida(peca: Peca) {
    this.pecaComidaEmit.emit(peca);
  }

  apagarLocaisAnteriores() {
    for (let casa of this.acoesPossiveis) {
      casa.cor = '';
    }
  }

  mudarTimeJogando() {
    this.timeJogandoEmit.emit();
    if (this.timeJogando === 'branco') this.timeJogando = 'preto';
    else this.timeJogando = 'branco';
  }

  //#region Xeque 

  verificarXeque(peca: Peca, posicao: Posicao){  
    if (peca instanceof Rei){
      if (peca.cor === "branco")
        this.posicaoReiTimeBranco = posicao;
      else
        this.posicaoReiTimePreto = posicao;
    }

    let posicaoRei: Posicao | undefined;
    if (this.timeJogando === "branco")
      posicaoRei = this.posicaoReiTimeBranco; 
    else
      posicaoRei = this.posicaoReiTimePreto;

    let xeques: Posicao[] = this.xequeService.verificarXeque(
      this.timeJogando, posicaoRei!, this.tabuleiroJogo)

    for (let xeque of xeques){
      let casaXeque = this.tabuleiroJogo[xeque.coluna][xeque.linha];
      casaXeque.cor = "red";
      this.acoesPossiveis.push(casaXeque);
    } 
  }

  //#endregion

  //#region Roque

  verificarRoqueInicio(peca: Peca){
    if (peca instanceof Torre || peca instanceof Rei)
      this.posicaoRoque = this.tabuleiroService.verificarPosicaoRoque(peca);
    else
      this.posicaoRoque = "";
  }

  verificarRoqueFinal(peca: Peca){
    if (peca instanceof Torre || peca instanceof Rei){
      this.posicaoRoque = "";
      if (peca.iniciando == true)
        peca.iniciando = false;  
    }
  }

  realizarRoque(posicaoRoque: string){
    this.tabuleiroJogo = 
      this.tabuleiroService.realizarRoque(posicaoRoque, this.tabuleiroJogo , this.pecaService)
    this.posicaoRoque = "";
    this.apagarLocaisAnteriores();
    this.mudarTimeJogando();
  }

  //#endregion

  //#region Peão

  verificarAcoesEspeciaisPeaoFinal(peca: Peca, coluna: number, linha: number) {
    if (peca instanceof Peao){
      if (peca.iniciando == true) {
        this.posicaoEnPassant = this.tabuleiroService.verificarEnPassant(peca, coluna, linha);
        this.timeEnPassant = peca.cor;
        peca.iniciando = false;
      }
      this.realizarEnPassant(peca.cor, coluna, linha);
      this.realizarPromocao(peca, coluna, linha);   
    }
  }

  realizarPromocao(peao: Peao, coluna: number, linha: number) {
    if (this.tabuleiroService.verificarPromocao(peao, coluna)){
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

  verificarEnPassantInicio(peca: Peca){
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
    ){
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

}
