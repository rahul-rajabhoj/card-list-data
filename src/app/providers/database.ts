import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { GeneralConstant } from '../utils/general-constant';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Database {
    public storage: SQLiteObject;

  constructor(private sqlite: SQLite) {}


  public openDB(): Promise<SQLiteObject> {
    return this.sqlite.create({
        name: GeneralConstant.DATABASE_NAME,
        location: GeneralConstant.DATABASE_LOCATION
    });
  }

  public getStorage(): SQLiteObject {
    return this.storage;
  }

}
