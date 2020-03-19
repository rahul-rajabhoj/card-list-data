import { Network } from '@ionic-native/network/ngx';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ConnectionStatus {

    constructor(private network: Network) { }

    isOnline(): boolean {
        return this.network.type !== this.network.Connection.NONE;
    }

}
