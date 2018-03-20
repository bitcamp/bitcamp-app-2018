import React, { Component } from 'react';

import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  AsyncStorage
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

class AnnouncementsScene extends Component {

  constructor(props) {
    super(props);
  }

  _renderRow(rowData) {
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
              <Text style={styles.timeText}>
                5:00PM, April 5
              </Text>
              <BoldAleoText style={styles.heading}>
                eee
              </BoldAleoText>
              <Text style={styles.description}>
                fesfes
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
    const fakeData = [
      {
        heading: 'hello',
        description: 'world',
      },
      {
        heading: 'hello',
        description: 'world',
      },
      {
        heading: 'hello',
        description: 'world',
      },
    ]
    return (
      <View style={styles.container}>
        <FlatList
          data={fakeData}
          renderItem={this._renderRow}
          keyExtractor = {(item, index) => index}
        />
      </View>
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
    backgroundColor: '#f4f4f4',
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

export default AnnouncementsScene;
