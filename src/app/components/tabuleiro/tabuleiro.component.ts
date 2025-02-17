import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Casa } from '../../models/casa.model';
import { Peca } from '../../models/peca.model';
import { Cavalo } from '../../models/pecas/cavalo.model';
import { Bispo } from '../../models/pecas/bispo.model';
import { Peao } from '../../models/pecas/peao.model';
import { Rainha } from '../../models/pecas/rainha.mode';
import { Rei } from '../../models/pecas/rei.model';
import { Torre } from '../../models/pecas/torre.model';
import { PecaService } from '../../services/peca.service';
import { Posicao } from '../../models/posicao.model';
import { RoqueService } from '../../services/roque.service';
import { PeaoService } from '../../services/peao.service';

@Component({
  selector: 'app-tabuleiro',
  standalone: false,

  templateUrl: './tabuleiro.component.html',
  styleUrl: './tabuleiro.component.css',
})
export class TabuleiroComponent implements OnInit {
  @Output() pecaComidaEmit = new EventEmitter<Peca>();
  @Output() timeJogandoEmit = new EventEmitter();

  colunaCasasAcao: Casa[][] = [];
  colunaCasasTabuleiro: Casa[][] = [];
  acoesPecaSelecionada: Casa[] = [];

  casaPecaSelecionada: Casa | undefined;
  posicaoPecaSelecionada: Posicao | undefined;

  posicaoPromocao: Posicao | undefined;
  posicaoEnPassant: Posicao | undefined = undefined;
  timeEnPassant: string = "";
  
  posicaoRoque = "";

  timeJogando = 'branco';
  jogoParado = false;

  constructor(
    private pecaService: PecaService, 
    private roqueService: RoqueService, 
    private peaoService: PeaoService
  ) {}

  async ngOnInit() {
    await this.definirArray();
    await this.prepararPecas();
  }

  async definirArray() {
    for (let i = 0; i <= 7; i++) {
      let coluna = 'par';
      if (i % 2 != 0) coluna = 'impar';

      this.colunaCasasTabuleiro[i] = [];
      for (let j = 0; j <= 7; j++) {
        this.colunaCasasTabuleiro[i].push(new Casa());
      }

      this.colunaCasasAcao = JSON.parse(
        JSON.stringify(this.colunaCasasTabuleiro)
      );
      await this.definirCasas(this.colunaCasasTabuleiro[i], coluna);
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

  async prepararPecas() {
    for (let i = 0; i <= 7; i++) {
      this.colunaCasasAcao[1][i].peca = new Peao('preto', this.pecaService);
      this.colunaCasasAcao[6][i].peca = new Peao('branco', this.pecaService);
    }

    this.colunaCasasAcao[0][0].peca = new Torre('preto', this.pecaService);
    this.colunaCasasAcao[0][7].peca = new Torre('preto', this.pecaService);
    this.colunaCasasAcao[7][0].peca = new Torre('branco', this.pecaService);
    this.colunaCasasAcao[7][7].peca = new Torre('branco', this.pecaService);

    this.colunaCasasAcao[0][1].peca = new Cavalo('preto', this.pecaService);
    this.colunaCasasAcao[0][6].peca = new Cavalo('preto', this.pecaService);
    this.colunaCasasAcao[7][1].peca = new Cavalo('branco', this.pecaService);
    this.colunaCasasAcao[7][6].peca = new Cavalo('branco', this.pecaService);

    this.colunaCasasAcao[0][2].peca = new Bispo('preto', this.pecaService);
    this.colunaCasasAcao[0][5].peca = new Bispo('preto', this.pecaService);
    this.colunaCasasAcao[7][2].peca = new Bispo('branco', this.pecaService);
    this.colunaCasasAcao[7][5].peca = new Bispo('branco', this.pecaService);

    this.colunaCasasAcao[0][4].peca = new Rei('preto', this.pecaService);
    this.colunaCasasAcao[7][4].peca = new Rei('branco', this.pecaService);

    this.colunaCasasAcao[0][3].peca = new Rainha('preto', this.pecaService);
    this.colunaCasasAcao[7][3].peca = new Rainha('branco', this.pecaService);
  }

  verificarMovimentos(peca: Peca, coluna: number, linha: number) {
    if (peca.cor === this.timeJogando && !this.jogoParado) {
      this.casaPecaSelecionada = this.colunaCasasAcao[coluna][linha];
      this.posicaoPecaSelecionada = new Posicao(coluna, linha);

      this.verificarEnPassantInicio(peca);

      peca.verMovimentosPossiveis(
        this.posicaoPecaSelecionada,
        peca.cor,
        this.colunaCasasAcao
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
        this.colunaCasasAcao[acao.coluna][acao.linha];
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
      this.colunaCasasAcao[col][ca].peca = undefined;

      this.apagarLocaisAnteriores();     

      if (casa.peca){
        this.verificarAcoesEspeciaisPeaoFinal(casa.peca, coluna, linha);
        this.verificarRoqueFinal(casa.peca);
      }

      this.mudarTimeJogando();
    }
  }

  sendPecaComida(peca: Peca) {
    this.pecaComidaEmit.emit(peca);
  }

  apagarLocaisAnteriores() {
    for (let local of this.acoesPecaSelecionada) {
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

  verificarRoqueInicio(peca: Peca){
    if (peca instanceof Torre || peca instanceof Rei)
      this.posicaoRoque = this.roqueService.verificarPosicaoRoque(peca);
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
    this.colunaCasasAcao = 
      this.roqueService.realizarRoque(posicaoRoque, this.colunaCasasAcao , this.pecaService)
    this.posicaoRoque = "";
    this.apagarLocaisAnteriores();
    this.mudarTimeJogando();
  }

  verificarAcoesEspeciaisPeaoFinal(peca: Peca, coluna: number, linha: number) {
    if (peca instanceof Peao){
      if (peca.iniciando == true) {
        this.posicaoEnPassant = this.peaoService.verificarEnPassant(peca, coluna, linha);
        this.timeEnPassant = peca.cor;
        peca.iniciando = false;
      }
      this.realizarEnPassant(peca.cor, coluna, linha);
      this.realizarPromocao(peca, coluna, linha);   
    }
  }

  realizarPromocao(peao: Peao, coluna: number, linha: number) {
    if (this.peaoService.verificarPromocao(peao, coluna)){
      this.posicaoPromocao = new Posicao(coluna, linha);
      this.jogoParado = true;
    }
  }

  confirmarPecaPeaoPromovido($event: Peca) {
    if (this.posicaoPromocao) {
      let col = this.posicaoPromocao.coluna;
      let ca = this.posicaoPromocao.linha;
      this.colunaCasasAcao[col][ca].peca = $event;
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
        pecaComida = this.colunaCasasAcao[coluna + 1][linha].peca;
        this.colunaCasasAcao[coluna + 1][linha].peca = undefined;
      } else {
        pecaComida = this.colunaCasasAcao[coluna - 1][linha].peca;
        this.colunaCasasAcao[coluna - 1][linha].peca = undefined;
      }
  
      if (pecaComida) this.sendPecaComida(pecaComida);    
    }
  }

}
