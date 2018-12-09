import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { DataService } from './data.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private data: DataService
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }

      this.data.setup()
      .then(info => {
        console.log('Database setup complete')
      })
      .catch(error => console.log('Error setting up the Database: ', error))
    })
  }
}
