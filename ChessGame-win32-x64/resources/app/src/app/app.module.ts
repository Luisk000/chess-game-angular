import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabuleiroComponent } from './components/tabuleiro/tabuleiro.component';
import { PainelComponent } from './components/painel/painel.component';
import { TabuleiroPromocaoComponent } from './components/tabuleiro/tabuleiro-promocao/tabuleiro-promocao.component';
import { TabuleiroRoqueComponent } from './components/tabuleiro/tabuleiro-roque/tabuleiro-roque.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    TabuleiroComponent,
    PainelComponent,
    TabuleiroPromocaoComponent,
    TabuleiroRoqueComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CdkDropList, 
    CdkDrag
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
