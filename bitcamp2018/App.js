/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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


const pageNumberTitles = [
  "Bitcamp 2018",
  "Schedule",
  "Announcements",
  "Map",
  // "Twitter"
]

export default class App extends React.Component {
  state = {
    title: pageNumberTitles[0]
  }

  changeHeaderTitle(pageNumber) {
    this.setState({
      title: pageNumberTitles[pageNumber]
    })
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: colors.mediumBrown }}>
          <StatusBar backgroundColor={ colors.darkBrown } barStyle="light-content"/>
          {/* Required to center the Title on iOS */}
          {
            (Platform.OS === 'ios') ? <Left /> : null
          }
          <Body>
            <Title style={{color:'#FFF'}}>{this.state.title}</Title>
          </Body>
          {/* TODO swap the icon with a QR icon */}
          <Right>
            <TouchableOpacity>
              <Icon name='menu' style={{ color: 'white' }}/>
            </TouchableOpacity>
          </Right>
        </Header>
        <MenuTab changeHeaderTitle={ this.changeHeaderTitle.bind(this) } />
      </Container>
    );
  }
}
