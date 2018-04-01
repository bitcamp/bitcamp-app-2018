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

import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase'

const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const ID = '@bitcampapp:userid';
const storedName = '@bitcampapp:firstName';
const androidChannel = 'bitcamp-notifications'

const pageNumberTitles = [
  "Bitcamp 2018",
  "Schedule",
  "FAQ",
  "Map"
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
      name: "",
    }
    this.getID = this.getID.bind(this);
  }

  componentDidMount(){
    Orientation.lockToPortrait();

    this.getID();

    if(Platform.OS === 'android'){

      // Build a channel
      const channel = new firebase.notifications.Android.Channel(androidChannel, 'bitcamp Announcements', firebase.notifications.Android.Importance.Max)
        .setDescription('Announcements from the bitcamp team');

      // Create the channel
      firebase.notifications().android.createChannel(channel);
    }

    // request permissions if not provided
    firebase.messaging().hasPermission().then(enabled => {
      if (enabled) {
        this.waitForNotification()
      } else {

        firebase.messaging().requestPermission()
          .then(() => {
            this.waitForNotification();
            console.log("Cool!");
          })
          .catch(error => {
            console.log("You suck");
          });
        }
      }).catch(err => {console.log(err); throw err;});
  }


  // notification listener that is called when a notification is recieved
  waitForNotification(){
    firebase.notifications().onNotification((notification: Notification) => {
      console.log(notification);
      console.log(notification.title);
      if(notification.title == null) {
        notification.setTitle('Bitcamp 2018');
      }

      if(Platform.OS === 'android') {

        if(notification.android.channelId == null){
          notification.android.setChannelId(androidChannel);
        }

        // if notification is recieved while app is open, provide these properties to present a complete notification
        notification.android.setVibrate([100, 200, 100, 500]);
        notification.android.setCategory(firebase.notifications.Android.Category.Reminder);
        notification.android.setLights(16740159, 500, 100);
        notification.android.setColor('#FF6F3F');
        notification.android.setPriority(firebase.notifications.Android.Priority.Max);

      }

      // if something goes wrong
      firebase.notifications().displayNotification(notification)
        .catch(error => {console.log(error)});
    });
  }

  // change page title of the current screen
  changeHeaderTitle(pageNumber) {
    this.setState({
      title: pageNumberTitles[pageNumber]
    })
  }

  // closes / opens modal
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  // close momdal
  _closeModal = () =>
    this.setState({ isModalVisible: false });

  // hits the endpoint to check to see if the user is part of the hackathon
  async _sendData(){
  	let password = this.state.password;
  	let email = this.state.email;
  	try {
	  	let response = await fetch('https://apply.bit.camp/auth/login', {
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
      let responseJson = await response.json();
  		let status = unescape(response['ok']);
  		if (status === "true") {
  			let token = unescape(responseJson['token']);
  			let id = unescape(responseJson['user']['id']);
        let username = unescape(responseJson['user']['profile']['firstName']);
  			this.setState({ name: username });
        this.setState({ id: id });
        AsyncStorage.setItem(ID, this.state.id, function(error){
          if (error){
            console.log("Error: " + error);
          }
        });
        AsyncStorage.setItem(storedName, this.state.name, function(error){
          if (error){
            console.log("Error: " + error);
         }
        });
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
  		Alert.alert(
          "Cound not connect.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
  	}

  // helper method that renders a button (returns jsx)
  _renderButton = (text, btnStyles, onPress) => (
    <Button
      primary
      style={btnStyles}
      onPress={onPress}
    >
      <BoldAleoText style={styles.btnText}>{text}</BoldAleoText>
    </Button>
  );

  // this method is called if the user is not logged in.
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

   // this method is called to retrieve data from the phone's storage
  async getID() {
    var thisBinded = this;
    thisBinded.savedData = "";
    thisBinded.savedData = await AsyncStorage.getItem(ID);
    thisBinded.firstName = await AsyncStorage.getItem(storedName);
    thisBinded.savedData = JSON.stringify(thisBinded.savedData);
    if (thisBinded.savedData != null && thisBinded.savedData != "" && thisBinded.savedData != "null") {
      thisBinded.setState({id: thisBinded.savedData});
      thisBinded.setState({name: thisBinded.firstName});
    }
  }

  // clears the storage of the phone and sets the state to empty
  async _logout_qr() {
    await AsyncStorage.removeItem(ID, function (err){
        if (err){
          console.log("Error: " + err);
        }
    });
    await AsyncStorage.removeItem(storedName, function (err){
        if (err){
          console.log("Error: " + err);
        }
    });
    this.setState({id: ""});
    this.setState({name: ""});
    this._closeModal();
  }

  // this method is called if there is no user logged in
  _renderQRContent = () => (
    <View style={{padding: 20, alignItems:'center', justifyContent: 'center'}}>
        <BoldAleoText
            style={{
              fontSize: 27,
              color: colors.midnightBlue,
              textAlign: 'center',
            }}>
            Hi {this.state.name}!{"\n"}{"\n"}
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

  // determines what to call for the modal and also displays the wrapper for all pages
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
            onBackButtonPress={() => this.setState({ isModalVisible: false })}
        	>
        	{content}
        </Modal>
      </View>

      </Container>
    );
  }
}

export default App;
