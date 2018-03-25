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
import firebaseApp from '../shared/firebase';

import scheduleData from '../assets/schedule.json'

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

class FaqScene extends Component {

  constructor(props) {
    super(props);
  }

  _renderRow(rowData) {
    console.log(rowData)
    return (
      <View style={styles.singleCard}>
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
              <Text style={styles.description}>
                {rowData.item.description}
              </Text>
            </View>
          </CardContent>
        </View>
      </View>

        </Card>
      </View>
    )
  }

  render() {
    const data = [
      {
        heading: `Where is Bitcamp?`,
        description: `We are proud to host Bitcamp at the Xfinity Center on the University of Maryland campus! This expansive sports arena is a unique spot for any event, and we’re excited to be back again!`
      },
      {
        heading: `How does travel work?`,
        description: `We'll have buses covering the hike from Stony Brook, NYU, GWU, Georgetown, American, and UMBC. If your school isn't covered, you can apply for travel reimbursement at www.bit.camp/travel-reimbursement`
      },
      {
        heading: `How do teams work?`,
        description: `Projects are submitted by teams to DevPost. You don't need to finalize your team until project submissions are due during the event. You may work individually or in a team of up to four campers. Don’t have a team in mind? No problem! Hacking will kick off with an optional team formation event.`
      },
      {
        heading: 'What is Slack?',
        description: `Throughout the event, we will be using Slack as the main form of communication for announcements, updates, and more.`,
      },
      {
        heading: 'What if I have no experience or ideas?',
        description: `Don't be afraid if you don't think you have enough experience, a team, or an idea. Everyone has a first hackathon, and we would love for Bitcamp to be yours! Mentors who are well-versed in a variety of topics will also be there to help you, whether it be finding a team, fleshing out an idea, or just figuring out where to begin.`,
      },
      {
        heading: 'What is Devpost?',
        description: 'After the 36 hours, you’ll be submitting your project to DevPost for judging! Find more information on Slack or on the Bitcamp website (www.bit.camp)',
      },
      {
        heading: `Are there any guidelines?`,
        description: `Don't bring any firearms, knives, weapons, drugs, or alcohol. Don't use an old project. Start a new trail instead! Also, please read the Major League Hacking Code of Conduct and the Bitcamp Terms, Code of Conduct, and Release Waiver. Organizers will enforce this code throughout the event. We are expecting cooperation from all participants to help ensure a safe environment for everybody (TL;DR be nice).`
      },
      {
        heading: `Other questions?`,
        description: `Send us an email at hello@bit.camp or message us on Slack or Facebook`
      },
    ]
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
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.midnightBlue,
    marginBottom: 4,
  },
  heading: {
    fontSize: 18,
    color: colors.mediumBlue,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  singleCard: {
    margin: 6,
    marginBottom: 0,
  },
  content: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    color: '#444',
  },
  text: {
    flex: 1,
  },
});

export default FaqScene;
