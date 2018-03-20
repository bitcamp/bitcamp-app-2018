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

import ScrollableTabView from 'react-native-scrollable-tab-view';
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

class ScheduleScene extends Component {

  constructor(props) {
    super(props);
    // this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
       dataSource: scheduleData.Schedule
    };
    // console.log(firebaseApp);
    // this.itemsRef = firebaseApp.database().ref();
  }

  // listenForItems() {
  //   this.itemsRef.on('value', (snap) => {
  //     const jsonDataBlob = snap.exportVal();
  //     this.setState({
  //       dataSource: this.ds.cloneWithRows(jsonDataBlob.Schedule)
  //     });
  //
  //     AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jsonDataBlob.Schedule), function(error){
  //       if (error){
  //         console.log("Error: " + error);
  //       }
  //     });
  //   });
  // }

  // async fetchData(){
  //   let savedData = [];
  //   try{
  //     savedData = await AsyncStorage.getItem(STORAGE_KEY);
  //     savedData = JSON.parse(savedData);
  //     if (savedData === null) savedData = [{type:"DATEHEADER", date:"Schedule coming soon!"}];
  //
  //   }catch(error){
  //     console.log('Error grabbing item from storage');
  //     console.log(error);
  //     savedData = [{type:"DATEHEADER", date:"Schedule coming soon!"}];
  //   }
  //   this.setState({
  //     dataSource: this.ds.cloneWithRows(savedData)
  //   });
  // }


  componentDidMount() {
    // make sure we aren't overwriting Firebase data with locally cached data
    //this.fetchData().then(this.listenForItems.bind(this));
    console.log(scheduleData);
  }

  _renderScheduleTabs(){

    return this.state.dataSource.
      map((scheduleForDay) => this._renderScheduleForDay(scheduleForDay))

  }

  _renderScheduleForDay(scheduleArray){

    scheduleArray[1] = scheduleArray[1].sort((event1, event2) => {
      start1 = moment(event1.startTime);
      start2 = moment(event2.startTime);

      end1 = moment(event1.endTime);
      end2 = moment(event2.endTime);

      if(start1 - start2 == 0){
        return end1 - end2;
      }

      return start1 - start2;
    })

    takenLabels = new Set(); //keeps track of which days have labels on them

    alteredData = scheduleArray[1];


    for (var i in alteredData){
      startTime = alteredData[i].startTime;

      label = this.normalizeTimeLabel(startTime);

      if(takenLabels.has(label)){
        alteredData[i].sizeLabel = '';
      }
      else {
        alteredData[i].sizeLabel = label;
        takenLabels.add(label);
      }

    }
    return (
      <FlatList
        tabLabel={scheduleArray[0]}
        data={alteredData}
        renderItem={this._renderRow}
        keyExtractor = {(item, index) => index}
      />
    );
  }


  normalizeTimeLabel(t){
    return moment(t).format("h:mm A")
  }

  _renderRow(rowData) {
    console.log(rowData.item.title);
    return (
      <View style = {styles.container}>
        <View style={styles.timeCol}>
          <AleoText style={styles.sideTimeText}>{rowData.item.sizeLabel}</AleoText>
        </View>
        <View style = {styles.cardCol}>
          <Card>
            <View style = {{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* <View style={styles.cardImgContainer}>
                <CardImage>
                  <Image
                    source={{uri: rowData.item.pictureUrl}}
                    style={styles.cardImg} />
                </CardImage>
              </View> */}
              <View style = {{ flex: 1, flexDirection: 'column'}}>
                <CardContent>
                  <BoldAleoText style={styles.heading}>
                    {rowData.item.title}
                  </BoldAleoText>
                  <Text style={styles.timeText}>
                    {rowData.item.startTime} - {rowData.item.endTime}
                  </Text>
                  <Text style={styles.location}>
                    {rowData.item.location}
                  </Text>
                  <Text style={styles.description}>
                    {rowData.item.description}
                  </Text>
                </CardContent>
              </View>
            </View>
          </Card>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollableTabView
        renderTabBar={() => <ScheduleSceneTabBarOverlay />}
        tabBarPosition={'top'}
        style ={styles.tabView}
        initialPage={0}
        keyExtractor = {(iterm, index) => index}
        tabBarUnderlineStyle = {{opacity: 0}}
      >
        {this._renderScheduleTabs()}
      </ScrollableTabView>
    );
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
  description: {
    fontSize: 16,
    opacity: .8,
    color: colors.midnightBlue,
  },
  location: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.mediumBlue,
  },
  sideTimeText: {
    fontSize: 14,
    color: colors.midnightBlue,
    opacity: .7,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.midnightBlue,
    marginBottom: 4,
  },
  heading: {
    fontSize: 18,
    color: colors.yellowOrange,
    marginBottom: 10,
  },
  tabView: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  timeCol: {
    flex: 1,
    paddingTop: 4,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cardCol: {
    flex: 4,
    paddingRight: 6,
    paddingBottom: 6,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  cardImgContainer: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  cardImg: {
    width: 60,
    height: 60,
    resizeMode: "stretch",
  },
  dateHeader: {
    paddingTop: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#a9a9a9',
    borderTopColor: '#a9a9a9',
    backgroundColor: '#ffaf3f',
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

export default ScheduleScene;
