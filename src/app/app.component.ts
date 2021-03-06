import { Component } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn = false;

  constructor(afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(x =>
    {
      this.loggedIn = x != null
    });
  }
}
