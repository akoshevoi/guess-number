// @flow
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: YOUR_API_KEY,
  authDomain: YOUR_AUTH_DOMAIN,
  databaseURL: YOUR_DATABASE_URL,
  projectId: YOUR_PROJECT_ID,
  storageBucket: '',
  messagingSenderId: YOUR_MESSAGING_SENDER_ID,
  appId: YOUR_APP_ID,
  measurementId: YOUR_MEASUREMENT_ID
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

  doCreateUser = (
    id: string,
    username: string,
    email: string,
    password: string
  ) =>
    this.db.ref(`users/${id}`).set({
      username,
      email,
      password
    });

  currentUser = () => this.auth.currentUser;
}

export default Firebase;
