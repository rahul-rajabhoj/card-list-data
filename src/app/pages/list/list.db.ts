import { Database } from 'src/app/providers/database';
import { ListConstants } from './list-constant';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ListTable {

    constructor(private database: Database) { }

    public TABLE_NAME = 'list_table';
    public COLUMN_ID = 'id';
    public COLUMN_IMAGE = 'image';
    public COLUMN_VALUE = 'value';
    public COLUMN_SUIT = 'suit';
    public COLUMN_CODE = 'code';

    public CREATE_TABLE_QUERY = `create table if not exists ${this.TABLE_NAME} (
        ${this.COLUMN_ID} integer primary key autoincrement ,
        ${this.COLUMN_IMAGE} text ,
        ${this.COLUMN_VALUE} text ,
        ${this.COLUMN_SUIT} text ,
        ${this.COLUMN_CODE} text)`;

    public DELETE_TABLE_QUERY = `DELETE FROM ${this.TABLE_NAME}`;

    public INSERT_QUERY = `insert into ${this.TABLE_NAME}(
        ${this.COLUMN_IMAGE},
        ${this.COLUMN_VALUE},
        ${this.COLUMN_SUIT},
        ${this.COLUMN_CODE}
        ) values (?,?,?,?)`;

    public FETCH_ALL_QUERY = `select * from ${this.TABLE_NAME}`;

    createTable(): Promise<any> {
        return this.database.getStorage().executeSql(this.CREATE_TABLE_QUERY, []);
    }

    deleteTable(): void {
        this.database.getStorage().executeSql(this.DELETE_TABLE_QUERY, []).then( result => {
            console.log(`delete ListTable result-> ${JSON.stringify(result)}`);
        }).catch( error => {
            console.error(`delete ListTable error-> ${JSON.stringify(error)}`);
        });
    }

    insertMultipleValues(listArray: Array<any>): Promise<any> {
        let batchData = [];
        listArray.map(list => {
            const data = this.convertDataToInsertArray(list);
            batchData.push([this.INSERT_QUERY, data]);
        });

        return this.database.getStorage().sqlBatch(batchData);
    }

    convertDataToInsertArray(list) {
        return [
            list[ListConstants.KEY_IMAGE],
            list[ListConstants.KEY_VALUE],
            list[ListConstants.KEY_SUIT],
            list[ListConstants.KEY_CODE]
        ];
    }

    getAllValues(): Promise<any> {
        return this.database.getStorage().executeSql(this.FETCH_ALL_QUERY, []);
    }

}


