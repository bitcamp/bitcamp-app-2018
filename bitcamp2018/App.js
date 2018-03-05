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
  Icon
} from 'native-base';
import Orientation from 'react-native-orientation';
import MenuTab from './MenuTab';
import { colors } from './shared/styles';
import Modal from "react-native-modal";

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
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
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

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

   _renderModalContent = () => (
    <View style={{padding: 20}}>
	    <Text 
	        style={{fontSize: 27}}>
	        Login
	    </Text>
	    <TextInput placeholder='Username' />
	    <TextInput placeholder='Password' />
	    <View style={{margin:7}} />
	    <Button 
            onPress={this.props.onLoginPress}
            title="Submit"
        	/>
	        {this._renderButton("Close", () => this.setState({ isModalVisible: false }))}

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
              <Image source={require('./assets/icons/qr_icon.png')} style={{width: 30, height: 30}} />
            </TouchableOpacity>
          </Right>
        </Header>
        <MenuTab changeHeaderTitle={this.changeHeaderTitle.bind(this) } />

        <View>
	        <Modal
	          isVisible={this.state.isModalVisible}
	          backdropColor={"white"}
	          backdropOpacity={0.85}
	          animationIn="zoomInDown"
	          animationOut="zoomOutUp"
	          animationInTiming={500}
	          animationOutTiming={500}
	          backdropTransitionInTiming={500}
	          backdropTransitionOutTiming={500}
	          avoidKeyboard={true}
        	>
          {this._renderModalContent()}
        </Modal>
      </View>

      </Container>
    );
  }
}
