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

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
})
export class TabuleiroComponent implements OnInit {
  @Output() pecaComidaEmit = new EventEmitter<Peca>();
  @Output() timeJogandoEmit = new EventEmitter();

  tabuleiroAcoes: Casa[][] = [];
  tabuleiroBackground: Casa[][] = [];
  acoesPecaSelecionada: Casa[] = [];

  casaPecaSelecionada: Casa | undefined;
  posicaoPecaSelecionada: Posicao | undefined;

  posicaoPromocao: Posicao | undefined;
  posicaoEnPassant: Posicao | undefined = undefined;
  timeEnPassant = "";
  
  posicaoRoque = "";

  timeJogando = 'branco';
  jogoParado = false;

  posicaoReiTimeBranco: Posicao | undefined;
  posicaoReiTimePreto: Posicao | undefined;

  constructor(
    private pecaService: PecaService,
    private tabuleiroService: TabuleiroService,
    private xequeService: XequeService
  ) {}

  async ngOnInit() {
    await this.prepararTabuleiro();
    
  }

  async prepararTabuleiro(){
    await this.definirColunas();
    let tabuleiroCopia = await JSON.parse(
      JSON.stringify(this.tabuleiroBackground)
    );
    this.tabuleiroAcoes = await
      this.tabuleiroService.prepararPecas(tabuleiroCopia, this.pecaService);

    this.posicaoReiTimeBranco = new Posicao(7, 4);
    this.posicaoReiTimePreto = new Posicao(0, 4);
  }

  async definirColunas() {
    for (let i = 0; i <= 7; i++) {
      let coluna = 'par';
      if (i % 2 != 0) coluna = 'impar';

      this.tabuleiroBackground[i] = [];
      for (let j = 0; j <= 7; j++) {
        this.tabuleiroBackground[i].push(new Casa());
      }      
      await this.definirCasas(this.tabuleiroBackground[i], coluna);
    }
  }

  async definirCasas(casas: Casa[], coluna: string) {
    let i = 0;
    for (let casa of casas) {
      if (coluna === 'par') {
        if (i % 2 == 0) casa.cor = 'white';
        else casa.cor = 'darkslategray';
      } else {
        if (i % 2 == 0) casa.cor = 'darkslategray';
        else casa.cor = 'white';
      }
      i++;
    }
  }

  verificarMovimentos(peca: Peca, coluna: number, linha: number) {
    if (peca.cor === this.timeJogando && !this.jogoParado) {
      this.casaPecaSelecionada = this.tabuleiroAcoes[coluna][linha];
      this.posicaoPecaSelecionada = new Posicao(coluna, linha);
      this.verificarEnPassantInicio(peca);
      

      peca.verMovimentosPossiveis(
        this.posicaoPecaSelecionada,
        peca.cor,
        this.tabuleiroAcoes
      );

      this.verificarRoqueInicio(peca)

      if (peca.acoes) 
        this.mostrarAcoesPossiveis(peca);

    }
  }
  
  mostrarAcoesPossiveis(peca: Peca){
    this.apagarLocaisAnteriores();
    for (let acao of peca.acoes) {
      let acaoPecaSelecionada =
        this.tabuleiroAcoes[acao.coluna][acao.linha];
      acaoPecaSelecionada.cor = 'LimeGreen';
      this.acoesPecaSelecionada.push(acaoPecaSelecionada);
    }
  }

  moverPeca(casa: Casa, coluna: number, linha: number) {
    if (casa.cor === 'LimeGreen') {
      if (casa.peca != undefined) this.sendPecaComida(casa.peca);

      casa.peca = this.casaPecaSelecionada?.peca;

      let col = this.posicaoPecaSelecionada!.coluna;
      let ca = this.posicaoPecaSelecionada!.linha;
      this.tabuleiroAcoes[col][ca].peca = undefined;

      this.apagarLocaisAnteriores();  
      this.mudarTimeJogando();   

      if (casa.peca){
        this.verificarAcoesEspeciaisPeaoFinal(casa.peca, coluna, linha);
        this.verificarRoqueFinal(casa.peca);
        this.verificarXeque(casa.peca, new Posicao(coluna, linha));
      }     
    }
  }

  sendPecaComida(peca: Peca) {
    this.pecaComidaEmit.emit(peca);
  }

  apagarLocaisAnteriores() {
    for (let local of this.acoesPecaSelecionada) {
      if (local.cor != 'red')
        local.cor = '';
    }
  }

  apagarLocaisXeque() {
    for (let local of this.acoesPecaSelecionada) {
      if (local.cor == 'red')
        local.cor = '';
    }
  }

  mudarTimeJogando() {
    this.timeJogandoEmit.emit();
    if (this.timeJogando === 'branco') this.timeJogando = 'preto';
    else this.timeJogando = 'branco';
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

  verificarXeque(peca: Peca, posicao: Posicao){  
    this.apagarLocaisXeque();    
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

    if (posicaoRei){
      let xeques: Posicao[] = this.xequeService.verificarXeque(
        this.timeJogando, posicaoRei, this.tabuleiroAcoes)

      for (let xeque of xeques){
        let casaXeque = this.tabuleiroAcoes[xeque.coluna][xeque.linha];
        casaXeque.cor = "red";
        this.acoesPecaSelecionada.push(casaXeque);
      }
            
    }
  }

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
    this.tabuleiroAcoes = 
      this.tabuleiroService.realizarRoque(posicaoRoque, this.tabuleiroAcoes , this.pecaService)
    this.posicaoRoque = "";
    this.apagarLocaisAnteriores();
    this.mudarTimeJogando();
  }

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
      this.tabuleiroAcoes[col][ca].peca = $event;
      this.posicaoPromocao = undefined;
      this.jogoParado = false;
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
        pecaComida = this.tabuleiroAcoes[coluna + 1][linha].peca;
        this.tabuleiroAcoes[coluna + 1][linha].peca = undefined;
      } else {
        pecaComida = this.tabuleiroAcoes[coluna - 1][linha].peca;
        this.tabuleiroAcoes[coluna - 1][linha].peca = undefined;
      }
  
      if (pecaComida) this.sendPecaComida(pecaComida);    
    }
  }

}
