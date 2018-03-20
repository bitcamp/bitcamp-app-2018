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
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  TouchableHighlight
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
  Form,
  Item,
  Input,
  Icon
} from 'native-base';
import Orientation from 'react-native-orientation';
import MenuTab from './MenuTab';
import { colors } from './shared/styles';
import Modal from "react-native-modal";
import aleofy from './shared/aleo';

const AleoText = aleofy(Text);

const pageNumberTitles = [
  "Bitcamp 2018",
  "Schedule",
  "Announcements",
  "Map",
  // "Twitter"
]

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btn: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.bitcampOrange,
    borderRadius: 2,
  },
  altBtn: {
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: colors.mediumBlue,
    borderRadius: 2,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
});

export default class App extends React.Component {
  state = {
    title: pageNumberTitles[0],
    isModalVisible: false,
  }

  changeHeaderTitle(pageNumber) {
    this.setState({
      title: pageNumberTitles[pageNumber]
    })
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  _closeModal = () =>
    this.setState({ isModalVisible: false });

   _renderModalContent = () => (
    <View>
        <Text
  	        style={{
              fontSize: 27,
              paddingLeft: 5,
              marginBottom: 10,
              color: colors.midnightBlue,
            }}>
  	        Login
  	    </Text>
        <Text
  	        style={{
              fontSize: 18,
              paddingLeft: 5,
              marginBottom: 20,
              color: "#808080",
            }}>
  	        Enter your login for your QR code.
  	    </Text>

        <Item>
          <Input placeholder="Username" />
        </Item>
        <Item>
          <Input placeholder="Password" />
        </Item>
	    <View style={{margin:7}} />
	    <Button
        primary
        style={styles.btn}
        onPress={this.props.onLoginPress}
      >
        <AleoText style={styles.btnText}>Login</AleoText>
      </Button>
      <Button
        primary
        style={styles.altBtn}
        onPress={() => this.setState({ isModalVisible: false })}
      >
        <AleoText style={styles.btnText}>Close</AleoText>
      </Button>
    </View>
  );

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: colors.mediumBrown}}>
          <StatusBar backgroundColor={ colors.darkBrown } barStyle="light-content"/>
          {/* Required to center the Title on iOS */}
          {
            (Platform.OS === 'ios') ? <Left /> : null
          }
          <Body>
            <Title style={{color:'#FFF',}}>{this.state.title}</Title>
          </Body>
          {/* TODO swap the icon with a QR icon */}
          <Right>
            <TouchableOpacity
	            onPress={this._toggleModal}>
              <Image source={require('./assets/icons/qr_icon.png')} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </Right>
        </Header>
        <MenuTab changeHeaderTitle={this.changeHeaderTitle.bind(this) } />

        <View>
	        <Modal
	          isVisible={this.state.isModalVisible}
	          backdropColor={'white'}
	          backdropOpacity={0.8}
	          animationIn="slideInUp"
	          animationOut="slideOutDown"
	          animationInTiming={250}
	          animationOutTiming={250}
	          backdropTransitionInTiming={250}
	          backdropTransitionOutTiming={250}
	          avoidKeyboard={true}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
        	>
          {this._renderModalContent()}
        </Modal>
      </View>

      </Container>
    );
  }
}
