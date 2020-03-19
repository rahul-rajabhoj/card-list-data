import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { GeneralConstant } from 'src/app/utils/general-constant';
import { DeckDataService } from 'src/app/providers/deck-data.service';
import { Card } from 'src/app/interfaces/card';
import { Deck } from 'src/app/interfaces/deck';
import { ListConstants } from './list-constant';
import { Router, NavigationExtras } from '@angular/router';
import { LocalStorageFunction } from 'src/app/utils/local-storage-function';
import { ListTable } from './list.db';
import { ConnectionStatus } from 'src/app/utils/connection-status';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  public cardListArray: Array<Card> = [];
  public currentDeck: Deck;
  public loading: any;

  constructor(
    private deckDataService: DeckDataService,
    private listTable: ListTable,
    private connection: ConnectionStatus,
    private localStorageFunction: LocalStorageFunction,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.presentLoadingWithOptions().then( loader => {
      this.doRefresh(false);
    });
  }

  getNewDeckData(): Promise<any> {
    return new Promise (resolve => {
      if (this.connection.isOnline()) {
        this.deckDataService.getNewDeckData(ListConstants.DECK_NUMBER).subscribe((data: Deck) => {
          this.localStorageFunction.setValue(ListConstants.KEY_DECK_DATA, JSON.stringify(data));
          this.currentDeck = data;
          resolve(true);
        }, err => {
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }

  getCardData(deckId: string): Promise<any> {
    return new Promise (resolve => {
      if (this.connection.isOnline()) {
        let cardNumber = ListConstants.CARD_NUMBER;
        if (this.currentDeck.remaining < ListConstants.CARD_NUMBER) {
          cardNumber = this.currentDeck.remaining;
        }
        this.deckDataService.getCardData(deckId, cardNumber).subscribe(data => {
          this.listTable.insertMultipleValues(data[ListConstants.KEY_CARDS]);
          this.currentDeck.remaining = data[ListConstants.KEY_REMAINING];
          this.cardListArray = [...this.cardListArray, ...data[ListConstants.KEY_CARDS]];
          resolve(true);
        }, err => {
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }

  doRefresh(event) {
    if (this.connection.isOnline()) {
      this.getNewDeckData().then(data => {
        if (data) {
          this.listTable.deleteTable();
          this.cardListArray = [];
          this.infiniteScroll.disabled = false;
          this.getCardData(this.currentDeck.deck_id).then(res => {
            if (this.loading) {
              this.loading.dismiss();
            }
            if (event) {
              event.target.complete();
            }
          });
        } else {
          if (this.loading) {
            this.loading.dismiss();
          }
          if (event) {
            event.target.complete();
          }
        }
      });
    } else {
      this.localStorageFunction.getValue(ListConstants.KEY_DECK_DATA).then(deckData => {
        if (deckData) {
          this.currentDeck = JSON.parse(deckData);
          this.listTable.getAllValues().then(cardData => {
            if (cardData.rows.length > 0) {
              this.cardListArray = [];
              this.infiniteScroll.disabled = false;
              for (let i = 0; i < cardData.rows.length; i++) {
                this.cardListArray.push(cardData.rows.item(i));
              }
              if (this.loading) {
                this.loading.dismiss();
              }
              if (event) {
                event.target.complete();
              }
            }
          }).catch( err => {
            console.error(JSON.stringify(err));
            if (this.loading) {
              this.loading.dismiss();
            }
            if (event) {
              event.target.complete();
            }
          });
        } else {
          if (this.loading) {
            this.loading.dismiss();
          }
          if (event) {
            event.target.complete();
          }
        }
      });
    }
  }

  loadData(event) {
    this.getCardData(this.currentDeck.deck_id).then(res => {
      event.target.complete();
    });
  }

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: GeneralConstant.REQUEST_TIMEOUT,
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  showDetail(card: Card) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        card: JSON.stringify(card)
      }
    };
    this.router.navigate(['list-detail'], navigationExtras);
  }

}
