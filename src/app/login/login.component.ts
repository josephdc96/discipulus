import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login = true;
  newUser = {
    email: '',
    name: '',
    username: '',
    password: '',
    repeatPassword: '',
    university: ''
  };
  logInUser = {
    username: '',
    password: ''
  };
  errorLogin = {
    error: false,
    message: ''
  };
  errorSignUp = {
    error: false,
    message: ''
  };
  private universitiesCollection: AngularFirestoreCollection<{ name: string }>;
  universities: University[];
  private user;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.universitiesCollection = afs.collection('universities');
    this.universitiesCollection.snapshotChanges().map(changes => {
      return changes.map((a): University => {
        const _name = a.payload.doc.data() as { name: string };
        const _id = a.payload.doc.id;
        return {
          id: _id,
          name: _name.name
        };
      });
    }).subscribe(data => {
      this.universities = data;
    });
    afAuth.authState.subscribe(u => this.user = u);
  }

  ngOnInit() {
  }

  logIn(): void {
    this.afAuth.auth.signInWithEmailAndPassword(this.logInUser.username, this.logInUser.password).catch(function (error) {
    });
  }

  NewUser(): void {
    if (this.newUser.university === '') {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Please select a university';
      return;
    } else if (this.newUser.password === '') {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Please enter a password';
      return;
    } else if (this.newUser.name === '') {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Please enter your name';
      return;
    } else if (this.newUser.username === '') {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Please enter your username';
    } else if (this.newUser.email === '') {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Please enter your email';
      return;
    } else if (this.newUser.password !== this.newUser.repeatPassword) {
      this.errorSignUp.error = true;
      this.errorSignUp.message = 'Passwords don\'t match';
      return;
    }
    this.afAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then(account => {
      this.createProfile(account);
    }).catch(error => {
      this.errorSignUp.error = true;
      this.errorSignUp.message = error.message;
    });
  }

  checkPasswords(): void {
    this.errorSignUp.error = this.newUser.password !== this.newUser.repeatPassword;
    this.errorSignUp.message = 'Passwords don\'t match';
  }

  createProfile(account: firebase.User): void {
    this.afs.collection('users').doc(account.uid).set({
      name: this.newUser.name,
      username: this.newUser.username,
      university: this.newUser.university
    }).catch(error => {
      this.errorSignUp.error = true;
      this.errorSignUp.message = error.message;
    });
  }
}


class University {
  name: string;
  id: string;
}
