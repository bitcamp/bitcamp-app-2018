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
  AsyncStorage,
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
  Form,
  Item,
  Input,
  Icon
} from 'native-base';
import Orientation from 'react-native-orientation';
import MenuTab from './MenuTab';
import { colors } from './shared/styles';
import Modal from "react-native-modal";
import QRCode from 'react-native-qrcode';
import aleofy from './shared/aleo';

const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const ID = '@bitcampapp:userid';

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
  headerTitle: {
    color:'#FFF',
    width: 300,
    textAlign: (Platform.OS === 'ios') ? 'center' : 'left',
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
  qr: {
    marginBottom: 80,
    marginTop: 40,
  }
});

class App extends Component {
  constructor(props) {

    super(props);
    this.savedData = "";

    this.state = {
      title: pageNumberTitles[0],
      isModalVisible: false,
      email: "",
      password: "",
      id: this.savedData,
      loaded: false,
    }
    this.getID = this.getID.bind(this);
  }

  componentDidMount(){
    this.getID();
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
      console.log("RESPONSE: " + unescape(JSON.parse(response)));
  		let status = unescape(JSON.parse(response['ok']));
  		if (status === "true") {
  			let token = unescape(JSON.parse(response['_bodyText'])['token']);
  			let id = JSON.parse(response['_bodyText'])['user']['id'];
  			this.setState({ id: id })
        /*AsyncStorage.setItem(ID, this.state.id, function(error){
          if (error){
            console.log("Error: " + error);
          }
        });*/
  		} else {
  			Alert.alert(
  			  "Incorrect credentials.",
  			  "Try again.",
  			  [
  			    {text: 'OK', onPress: () => console.log('OK Pressed')},
  			  ],
  			  { cancelable: false }
        );
      }
  	} catch (error) {
  		throw error;
  	}
	//let responseJson = await response.json();
  }

  _renderButton = (text, btnStyles, onPress) => (
    <Button
      primary
      style={btnStyles}
      onPress={onPress}
    >
      <BoldAleoText style={styles.btnText}>{text}</BoldAleoText>
    </Button>
  );


   _renderModalContent = () => (
    <View style={{padding: 20}}>
      <AleoText
          style={{
            fontSize: 27,
            paddingLeft: 5,
            marginBottom: 10,
            color: colors.midnightBlue,
          }}>
          Login
      </AleoText>
      <AleoText
          style={{
            fontSize: 18,
            paddingLeft: 5,
            marginBottom: 20,
            color: "#808080",
          }}>
          Enter your login for your QR code.
      </AleoText>
      <Item>
        <Input placeholder="Email" onChangeText={(email) => this.setState({email})} />
      </Item>
      <Item>
        <Input placeholder="Password" secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
      </Item>
	    <View style={{margin:7}}/>
      {
        this._renderButton("Submit", styles.btn, () => this._sendData())
      }
	    {
        this._renderButton("Close", styles.altBtn, () => this._closeModal())
      }
    </View>
  );

  async getID() {
    /*var thisBinded = this;
    thisBinded.savedData = "";
    thisBinded.savedData = await AsyncStorage.getItem(ID);
    thisBinded.savedData = JSON.parse(savedData);
    if (savedData !== null) {
      thisBinded.setState({id: thisBinded.savedData});
    }*/
  }

  async _logout_qr() {
    await AsyncStorage.removeItem(ID, function (err){
        if (err){
          console.log("Error: " + err);
        }
    });
    this._closeModal();
  }

  _renderQRContent = () => (
    <View style={{padding: 20, alignItems:'center', justifyContent: 'center'}}>
        <BoldAleoText
            style={{fontSize: 27, color: colors.midnightBlue}}>
            Your QR Code
        </BoldAleoText>
        <View style={styles.qr}>
          <QRCode
              value={this.state.id}
              size={200}
              bgColor='black'
              fgColor='white'
          />
        </View>
        {this._renderButton("Logout", styles.btn, () => this._logout_qr())}
        {this._renderButton("Close", styles.altBtn, () => this._closeModal())}
    </View>
  );

  render() {
    if(this.state.id === ""){
      content = this._renderModalContent();
    }else{
      content = this._renderQRContent();
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
            <Title style={styles.headerTitle}>
              <BoldAleoText>{this.state.title}</BoldAleoText>
            </Title>
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
	          backdropOpacity={0.9}
	          animationIn="slideInUp"
	          animationOut="slideOutDown"
	          animationInTiming={250}
	          animationOutTiming={250}
	          backdropTransitionInTiming={250}
	          backdropTransitionOutTiming={250}
	          avoidKeyboard={true}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
        	>
        	{content}
        </Modal>
      </View>

      </Container>
    );
  }
}

export default App;