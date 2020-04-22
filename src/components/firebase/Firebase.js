// @flow
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBdEqmkmoXzVNvueEMfA8kutV2wiuW33sI',
  authDomain: 'guess-number-bc6db.firebaseapp.com',
  databaseURL: 'https://guess-number-bc6db.firebaseio.com',
  projectId: 'guess-number-bc6db',
  storageBucket: 'guess-number-bc6db.appspot.com',
  messagingSenderId: '723180061676',
  appId: '1:723180061676:web:be52c856f69247a98eb6c9',
  measurementId: 'G-6K05SRBDFQ'
};

class Firebase {
  auth: Function;
  db: Function;
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  /*** Auth API ***/
  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  /*** User API ***/
  users = () => this.db.ref('users');

  user = (uid: string) => this.db.ref(`users/${uid}`);

  currentUser = () => this.auth.currentUser;
}

export default Firebase;
