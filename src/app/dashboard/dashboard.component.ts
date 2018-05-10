import { Component, OnInit } from '@angular/core';
import {User} from '../entities/user.object';
import { University } from '../entities/university.object';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Thread} from '../entities/thread.object';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User = {
    name: '',
    username: '',
    uid: '',
    university: {
      name: '',
      partner: false,
      avatar: ''
    },
    avatar: '',
  };
  messages: Thread[];
  semesters = [
    {
      name: 'Fall 2015',
      classes: [
        {
          title: 'Fundamentals of Computing I',
          grade: 92,
          code: 'COMP1210'
        }
      ]
    }
  ];

  constructor(db: AngularFirestore, afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(authUser => {
      if (authUser != null) {
        const userDoc = db.doc<User>('users/' + authUser.uid);
        userDoc.valueChanges().subscribe(data => {
          const univDoc = db.doc<University>('universities/' + data.university);
          univDoc.valueChanges().subscribe(univ => {
            this.user = {
              uid: authUser.uid,
              username: data.username,
              name: data.name,
              avatar: data.avatar,
              university: univ
            };
          });
        });
      }
    });

    if (this.user != null) {
      const msgColl = db.collection('messages', ref => ref.where('users.' + this.user.username, '==', true));
      msgColl.snapshotChanges().map(changes => {
        return changes.map((a): Thread => {
          const _data = a.payload.doc.data();
          let _users: User[] = [];
          for (const key of _data.users) {
            console.log(key);
            const userDoc = db.collection<User>('messages.messages', ref => ref.where('username', '==', key))
              .valueChanges().subscribe(x => {
              _users.push(x[0]);
            });
          }

          if (_data.is_group) {
            let name: string;
            let avatar: string;
            if (_data.name !== null) {
              name = _data.name;
            } else {
              name = '';
              _users.filter(x => x.username !== this.user.username).forEach(x => name = name + x.name + ', ');
            }
            if (_data.avatar !== null) {
              avatar = _data.avatar;
            } else {
              avatar = null;
            }
            return {
              messages: [],
              users: _users,
              name: name,
              avatar: avatar
            };
          } else {
            const name = _users.filter(x => x.username !== this.user.username)[0].name;
            const avatar = _users.filter(x => x.username !== this.user.username)[0].avatar;
            return {
              messages: [],
              users: _users,
              name: name,
              avatar: avatar
            };
          }
        });
      }).subscribe(data => this.messages = data);
    }
  }

  ngOnInit() {
  }

  getContent(message): string {
    if (message.messages.length > 0) {
      return message.messages[0].content;
    } else {
      return 'No Messages';
    }
  }

}
