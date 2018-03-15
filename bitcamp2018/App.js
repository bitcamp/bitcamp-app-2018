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
  TouchableHighlight,
  Alert
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
import QRCode from 'react-native-qrcode';

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
    email: "",
    password: "",
    id: ""
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

  async _sendData(){
  	let password = this.state.password;
  	let email = this.state.email;
  	try {
	  	let response = await fetch('http://35.174.30.108:3000/auth/login', {
		  method: 'POST',	
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    email: email,
		    password: password,
		  }),
		});
		let status = unescape(JSON.parse(response['ok']));
		if(status === "true"){
			let token = unescape(JSON.parse(response['_bodyText'])['token']);
			let id = JSON.parse(response['_bodyText'])['user']['id'];
			this.setState({ id: id })
			
		}else{
			Alert.alert(	
			  "Incorrect credentials.",
			  "Try again.",
			  [
			    {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false });
		}
		
	}catch(error){
		Alert.alert(	
			  "Could not connect.",
			  "Try again.",
			  [
			    {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false });
	}

	//let responseJson = await response.json();

  }


   _renderModalContent = () => (
    <View style={{padding: 20}}>
	    <Text 
	        style={{fontSize: 27}}>
	        Login
	    </Text>
	    <TextInput placeholder='email' onChangeText={(email) => this.setState({email})} />
	    <TextInput placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
	    <View style={{margin:7}} />
	    {this._renderButton("Submit", () => this._sendData())}
	    {this._renderButton("Close", () => this.setState({ isModalVisible: false }))}

    </View>
  );

  render() {
  	let content;
  	if(this.state.id === ""){
  		content = (
  	<View style={{padding: 20}}>
	    <Text 
	        style={{fontSize: 27}}>
	        Login
	    </Text>
	    <TextInput placeholder='email' onChangeText={(email) => this.setState({email})} />
	    <TextInput placeholder='password' secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
	    <View style={{margin:7}} />
	    {this._renderButton("Submit", () => this._sendData())}
	    {this._renderButton("Close", () => this.setState({ isModalVisible: false }))}

    </View>);
  	}else{
  		content = (
		<View style={{padding: 20, alignItems:'center', justifyContent: 'center'}}>
		    <Text 
		        style={{fontSize: 27}}>
		        Your QR Code
		    </Text>
  			<QRCode
	          value={this.state.id}
	          size={200}
	          bgColor='black'
	          fgColor='white'/>
	        {this._renderButton("Logout", () => this._sendData())}
	    	{this._renderButton("Close", () => this.setState({ isModalVisible: false }))}
		</View>
	          );
  	}
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
        	{content}         
        </Modal>
      </View>

      </Container>
    );
  }
}
