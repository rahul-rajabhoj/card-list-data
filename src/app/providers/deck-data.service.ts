import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralConstant } from '../utils/general-constant';

@Injectable({
  providedIn: 'root'
})
export class DeckDataService {

  constructor(private http: HttpClient) { }

  getNewDeckData(deckCount: number): Observable<any> {

    const param = new HttpParams().set(GeneralConstant.PARAM_DECK_COUNT, deckCount.toString()),

    url = `${GeneralConstant.APPLICATION_URL}${GeneralConstant.NEW_SHUFFLE}`;

    return this.http.get(url, { params: param});

  }

  getCardData(deckId: string, cardCount: number): Observable<any> {

    const param = new HttpParams().set(GeneralConstant.PARAM_COUNT, cardCount.toString()),

    url = `${GeneralConstant.APPLICATION_URL}${deckId}${GeneralConstant.DRAW_CARDS}`;

    return this.http.get(url, { params: param});

  }

}
