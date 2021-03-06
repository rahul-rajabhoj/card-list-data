import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GeneralConstant } from './utils/general-constant';
import { Database } from './providers/database';
import { ListTable } from './pages/list/list.db';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private database: Database,
    private listTable: ListTable
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.database.openDB().then(db => {
        this.database.storage = db;
        this.listTable.createTable().then(res => {
          this.statusBar.backgroundColorByHexString(GeneralConstant.THEME_PRIMARY_COLOR);
          this.splashScreen.hide();
        });
      });
    });
  }
}
