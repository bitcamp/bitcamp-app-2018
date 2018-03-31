import React, { Component } from 'react';

import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import Accordion from './Accordion'
import moment from 'moment'
import ScheduleSceneTabBarOverlay from './ScheduleSceneTabBarOverlay';

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import { colors } from '../shared/styles';
import aleofy from '../shared/aleo';
// import firebaseApp from '../shared/firebase';
import Modal from "react-native-modal";

// import scheduleData from '../assets/schedule.json'

/*// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDA47vn27sRJVu575IcduceK7ahZsWrJA",
  authDomain: "bitcamp-app.firebaseapp.com",
  databaseURL: "https://bitcamp-app.firebaseio.com/",
  storageBucket: ""
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
*/

const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const STORAGE_KEY = '@bitcampapp:schedule'; // the @ may need to be modified...

const data = [
  {
    heading: `What is Bitcamp?`,
    description: `Bitcamp is a hackathon that values participant experience and mentorship over competitiveness and points. Come to have fun with your friends, learn something new, eat s’mores, and have a generally awesome time. We have all sorts of crazy activities planned for you...come find out the rest!`
  },
  {
    heading: `Where is Bitcamp?`,
    description: `We are proud to host Bitcamp at the Xfinity Center, located at 8500 Paint Branch Dr, College Park, MD 20740.`
  },
  {
    heading: `How can I travel to Bitcamp?`,
    description: `We'll have buses covering the hike from Stony Brook, NYU, GWU, Georgetown, American, and UMBC. If your school isn't covered, you can apply for travel reimbursement at www.bit.camp/travel-reimbursement`
  },
  {
    heading: `How do teams work?`,
    description: `Projects are submitted by teams to DevPost. You don't need to finalize your team until project submissions are due during the event. You may work individually or in a team of up to four campers. Don’t have a team in mind? No problem! Hacking will kick off with an optional team formation event.`
  },
  {
    heading: `What is my QR code?`,
    description: `Your QR code is your unique identifier to allow for faster check-ins at Bitcamp this year. Tap the QR code icon to the right of the heading above to log in and access it. Use the email and password you used to apply for Bitcamp.`
  },
  {
    heading: `What are the stars next to each scheduled event? `,
    description: `Tap the stars to mark events that you are interested in. Favorited events will notify your phone with reminders so you don't miss them!`
  },
  {
    heading: 'What if I have no coding experience or ideas?',
    description: `Don't be afraid if you don't think you have enough experience, a team, or an idea. Everyone has a first hackathon, and we would love for Bitcamp to be yours! Mentors who are well-versed in a variety of topics will also be there to help you, whether it be finding a team, fleshing out an idea, or just figuring out where to begin.`,
  },
  {
    heading: 'What is Slack?',
    description: `Throughout the event, we will be using Slack as the main form of communication for announcements, updates, and more.`,
  },
  {
    heading: 'What is Devpost?',
    description: 'After the 36 hours, you’ll be submitting your project to DevPost for judging! Find more information on Slack or on the Bitcamp website (www.bit.camp)',
  },
  {
    heading: `What are the Guidelines for Bitcamp and MLH?`,
    description: `Don't bring any firearms, knives, weapons, drugs, or alcohol. Don't use an old project. Start a new trail instead! Also, please read the Major League Hacking Code of Conduct and the Bitcamp Terms, Code of Conduct, and Release Waiver on the Bitcamp website. Organizers will enforce this code throughout the event. We are expecting cooperation from all participants to help ensure a safe environment for everybody (TL;DR be nice).`
  },
  {
    heading: `Other questions?`,
    description: `Send us an email at hello@bit.camp or message us on Slack or Facebook`
  },
];

class FaqScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      modalQuestion: "",
      modalAnswer: "",
    }
  }

  _toggleModal = (question, answer) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      modalQuestion: question,
      modalAnswer: answer,
    });
  }

  _closeModal = () =>
    this.setState({ isModalVisible: false });


  _renderRow(rowData) {
    console.log(rowData)
    return (
      <View style={styles.singleCard}>
        <View style={styles.cardShadow}>
        <TouchableOpacity
          onPress={() => { this._toggleModal(rowData.item.heading, rowData.item.description); }}
        >
            <Card>
              <View style = {{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style = {{ flex: 1, flexDirection: 'column'}}>
                  <CardContent>
                    <View style={styles.cardContent}>
                      <BoldAleoText style={styles.heading}>
                        {rowData.item.heading}
                      </BoldAleoText>
                      {/* <Text style={styles.description}> */}
                        {/* {rowData.item.description} */}
                      {/* </Text> */}
                    </View>
                  </CardContent>
                </View>
              </View>
            </Card>
        </TouchableOpacity>
      </View>
      </View>
    )
  }

  render() {

    return (
      <ImageBackground
       style={styles.container}
       source={require('./images/background.png')}>
        <View style={styles.container}>
          <FlatList
            data={data}
            renderItem={(rowData) => this._renderRow(rowData)}
            keyExtractor = {(item, index) => index.toString()}
          />
        </View>
        <View>
          <Modal
            isVisible={this.state.isModalVisible}
            backdropColor={'white'}
            backdropOpacity={0.95}
            animationInTiming={250}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationOutTiming={250}
            backdropTransitionInTiming={250}
            backdropTransitionOutTiming={250}
            avoidKeyboard={true}
            onBackdropPress={() => this.setState({ isModalVisible: false })}
            onBackButtonPress={() => this.setState({ isModalVisible: false })}
          >
            <BoldAleoText style={styles.modalHeading}>
              {this.state.modalQuestion}
            </BoldAleoText>
            <Text style={styles.modalDescription}>
              {this.state.modalAnswer}
            </Text>
          </Modal>
        </View>

      </ImageBackground>
    )
  }
}
  //   if (rowData.type === 'DATEHEADER') {
  //     return (
  //       <View style={styles.dateHeader}>
  //         <BoldAleoText style={{color: '#ffffff'}}>{rowData.date}</BoldAleoText>
  //       </View>
  //     );
  //   } else {
  //     var company;
  //     var location;
  //     if (rowData.company.length != 0) {
  //       company = (<AleoText style={styles.content}>Company: {rowData.company}</AleoText>);
  //     }
  //     if (rowData.location.length != 0) {
  //       location = (<AleoText style={styles.content}>Location: {rowData.location}</AleoText>);
  //     }
  //     return (
  //       <Accordion time={rowData.time} title={rowData.name}>
  //         <View style={{
  //           backgroundColor: '#ffffff'
  //         }}>
  //           <AleoText style={styles.content}>{rowData.description}</AleoText>
  //           {company}
  //           {location}
  //         </View>
  //       </Accordion>
  //     );
  //   }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    opacity: .8,
    color: colors.midnightBlue,
  },
  modalDescription: {
    fontSize: 18,
    opacity: .8,
    color: colors.midnightBlue,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.midnightBlue,
    marginBottom: 4,
  },
  heading: {
    fontSize: 18,
    color: colors.mediumBlue,
  },
  modalHeading: {
    fontSize: 24,
    color: colors.mediumBlue,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  singleCard: {
    margin: 6,
    marginBottom: 4,
  },
  cardShadow: {
    backgroundColor : '#ffffff',
    elevation: 2,
  },
  content: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: '#444444',
  },
  text: {
    flex: 1,
  },
});

export default FaqScene;
