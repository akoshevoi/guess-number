// @flow
import React from 'react';

/* 
 Если написать так, тогда некоторые ошибки в flow исчезнут, 
 но появятся ошибки в браузере и приложение не будет работать.
 
type Props = Any;

const FirebaseContext = React.createContext<null>(null);

export const withFirebase = 
<Props extends object>(Component:React.ComponentType<Props>) => 
(props : Any) => (
  <FirebaseContext.Consumer>
    {firebase => <Component { ...props } firebase={firebase} />}
  </FirebaseContext.Consumer>
);
*/

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component { ...props } firebase={firebase} />}
  </FirebaseContext.Consumer>
);


export default FirebaseContext;