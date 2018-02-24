/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Right,
  Button,
  Icon
} from 'native-base';
import Orientation from 'react-native-orientation';
import MenuTab from './MenuTab';
import { colors } from './shared/styles';


// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// export default class App extends Component<{}> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <StatusBar
//           backgroundColor="blue"
//           barStyle="light-content"
//         />
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     // backgroundColor: '#F5FCFF',
//   },
// });

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <Header style={{backgroundColor: colors.mediumBrown }}>
          <StatusBar barStyle="light-content"/>
          <Left>
            <Button transparent>
              <Icon name='menu' style={{ color: 'white' }}/>
            </Button>
          </Left>
          <Body>
            <Title style={{color:'#FFF'}}>Bitcamp 2018</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <MenuTab />
      </Container>
    );
  }
}
