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
  Platform,
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

import Icon from 'react-native-vector-icons/FontAwesome'

import { colors } from '../shared/styles';
import aleofy from '../shared/aleo';

import scheduleData from '../assets/schedule.json'
import firebase from 'react-native-firebase';

const AleoText = aleofy(Text);
const BoldAleoText = aleofy(Text, 'Bold');
const STORAGE_KEY = '@bitcampapp:schedule'; // the @ may need to be modified...

class EventCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      favorited: false
    };
  }

  triggerButtonPress(){

    console.log("hello world");
  }

  render() {
    return (
      <View
      style = {styles.container}>
        <View style={styles.timeCol}>
          <AleoText style={styles.sideTimeText}>{this.props.sizeLabel}</AleoText>
        </View>
        <View style = {styles.cardCol}>
          <View style = {styles.cardShadow}>
            <Card>
              <View style = {styles.cardLayout}>
                {/* <View style={styles.cardImgContainer}>
                  <CardImage>
                    <Image
                      source={{uri: rowData.item.pictureUrl}}
                      style={styles.cardImg} />
                  </CardImage>
                </View> */}
                <View style = {styles.cardText}>
                  <CardContent>
                    <View style = {styles.cardHeader}>
                      <BoldAleoText style={styles.heading}>
                        {this.props.title}
                      </BoldAleoText>
                      <View style = {styles.starIcon}>
                        <Icon
                          name = {this.state.favorited ? 'star' : 'star-o'}
                          size = {24}
                          color={colors.bitcampOrange}
                          onPress = {this.triggerButtonPress()}
                        />
                      </View>
                    </View>
                    <Text style={styles.timeText}>
                      {this.props.startTimeFormatted} - {this.props.endTimeFormatted}
                    </Text>
                    <Text style={styles.location}>
                      {this.props.location}
                    </Text>
                    <Text style={styles.description}>
                      {this.props.description}
                    </Text>
                  </CardContent>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </View>
    );
  }
}

class ScheduleScene extends Component {

  constructor(props) {
    super(props);
    this.ds = scheduleData;

    this.state = {
       dataSource: this.ds.Schedule,
    };

    this.itemRef = firebase.database().ref();
    this.fetchPrelim = this.fetchPrelim.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this._renderScheduleTabs = this._renderScheduleTabs.bind(this);

  }


  componentDidMount() {
    // make sure we aren't overwriting Firebase data with locally cached data
    let timeoutObj = setTimeout(() => {this.fetchPrelim()}, 5000)

    this.fetchData(timeoutObj)

  }

  fetchPrelim(){

    AsyncStorage.getItem(STORAGE_KEY, (err, result) => {
        if(result != null){
          console.log("Result:")
          console.log(result);
          this.ds = JSON.parse(result);
          console.log(this.ds);
          this.setState({dataSource:this.ds.Schedule});
        }

        //alert user that there is no connection
    });
  }

  fetchData(timeoutObj){
    // var thisBinded = this;
    this.itemRef.on('value', async (snapshot) => {
      //this.setState({dataSource:snapshot.val().Schedule});
      var data = snapshot.val();
      this.ds = data;
      console.log(data);
      this.setState({dataSource:this.ds.Schedule});

      clearTimeout(timeoutObj);

      console.log("Updating store:")
      console.log(this.ds);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.ds), function(error){
        if (error){
          throw error;
        }
      });
    })
  }

  _renderScheduleTabs(){
    var thisBinded = this;
    return this.state.dataSource.
      map((scheduleForDay) => thisBinded._renderScheduleForDay(scheduleForDay))

  }

  _renderScheduleForDay(scheduleArray){

    alteredData = scheduleArray[1].sort((event1, event2) => {
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
        key = {scheduleArray[0]}
        tabLabel={scheduleArray[0]}
        data={alteredData}
        renderItem={this._renderRow.bind(this)}
        keyExtractor = {(item, index) => item.key.toString()}
      />
    );
  }


  normalizeTimeLabel(t){
    return moment(t).format("h:mm A")
  }


  _renderRow(rowData) {
    return (
      <EventCard
        sizeLabel = {rowData.item.sizeLabel}
        title = {rowData.item.title}
        startTime = {rowData.item.startTime}
        endTime = {rowData.item.endTime}
        startTimeFormatted = {this.normalizeTimeLabel(rowData.item.startTime)}
        endTimeFormatted = {this.normalizeTimeLabel(rowData.item.endTime)}
        location = {rowData.item.location}
        description = {rowData.item.description}/>);
  }

  render() {
    return (
      <ImageBackground
       style={styles.container}
       source={require('./images/background.png')}>
        <ScrollableTabView
          renderTabBar={() => <ScheduleSceneTabBarOverlay />}
          tabBarPosition={'top'}
          style ={styles.tabView}
          initialPage={0}
          keyExtractor = {(item, index) => index}
          tabBarUnderlineStyle = {{opacity: 0}}
        >
          {this._renderScheduleTabs()}
        </ScrollableTabView>
      </ImageBackground>
    );
  }

}


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
    flex: 5,
  },
  tabView: {
    flex: 1,
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
  cardShadow: {
    backgroundColor : '#ffffff',
    elevation: 2
  },
  cardLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardText: {
    flex: 1,
    flexDirection: 'column'
  },
  cardHeader: {
    flexDirection: 'row'
  },
  starIcon: {
    flexDirection: 'row-reverse',
    flex: 1
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
