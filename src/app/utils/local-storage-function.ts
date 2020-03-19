import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageFunction {

    constructor(private storage: Storage) {}

    setValue(key: string, value: any): Promise<any> {
        return this.storage.set(key, value);
    }

    getValue(key: string): Promise<any> {
        return this.storage.get(key);
    }

    removeKey(key: string) {
        return this.storage.remove(key);
    }

}
