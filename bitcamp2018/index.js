import { AppRegistry } from 'react-native';
import App from './App';

// The warning for setting a timer on reactnative android being a bug is actually
// a react native bug lol, this will hide the warning while developing
console.ignoredYellowBox = [ 'Setting a timer' ]

AppRegistry.registerComponent('bitcamp2018', () => App);
