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
  TouchableHighlight,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import Accordion from './Accordion'
import moment from 'moment'
import hash from 'object-hash'
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
const STORAGE_KEY = '@bitcampapp:schedule';
const EVENT_FAVORITED_KEY_PREFIX = '@bitcampapp:isFavorited';
const EVENT_ID_PREFIX = 'eventNotification-';
const channel = new firebase.notifications.Android.Channel('test-channel', 'Test-Channel', firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');

// Each event card displayed for each day
class EventCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      favorited: false
    };

    this.customizeNotification = this.props.customizeNotification;
    this.scheduleNotification = this.props.scheduleNotification;

    AsyncStorage.getItem(EVENT_FAVORITED_KEY_PREFIX + this.props.eventKey.toString(), (err, results) => {
      //retrieve whether the event was favorited and update state to reflect change
      if(results != null && results != 'null'){
        console.log("myId: " + this.props.eventKey.toString() + " isFavorited: " + results)
        this.setState((prevState, props) => {return {favorited : JSON.parse(results)}});
      } else {
        this.setState((prevState, props) => {return {favorited : false}});

        //update status to not favorited
        AsyncStorage.setItem(EVENT_FAVORITED_KEY_PREFIX + this.props.eventKey.toString(), JSON.stringify(false), function(error){
          if(error){
            console.log(error);
          }
        });
      }
    });
  }

  triggerButtonPress(){

    //retrieve the notification and cancel it
    if(this.state.favorited) {

      firebase.notifications().cancelNotification(EVENT_ID_PREFIX +  this.props.eventKey.toString());

    // set up a new notification
    } else {

        const notification = new firebase.notifications.Notification()
          .setNotificationId(EVENT_ID_PREFIX + this.props.eventKey.toString())
          .setTitle(this.props.title)
          .setBody('10 minutes until event start!')
          .setData({
            type: 'eventAlert'
          });

        this.customizeNotification(notification);
        this.scheduleNotification(notification, this.props.startTime);
    }

    //swaps icon
    this.setState((prevState, props) => {return {favorited : !prevState.favorited}},
      () => {
        //callback to update the state of the store
        //console.log("myId: " + this.props.eventKey.toString() + " setting isFavorited: " + this.state.favorited.toString());
        //update status of notification
        AsyncStorage.setItem(EVENT_FAVORITED_KEY_PREFIX + this.props.eventKey.toString(), JSON.stringify(this.state.favorited), function(error){
          if(error){
            console.log(error);
          }
        });
      });
  }

  // renders each card
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
                {}
                <View style = {styles.cardText}>
                  <CardContent>
                    <View style = {styles.cardHeader}>
                      <BoldAleoText style={styles.heading}>
                        {this.props.title}
                      </BoldAleoText>
                      <View style = {styles.starIcon}>
                        <TouchableHighlight onPress = {this.triggerButtonPress.bind(this)} activeOpacity = {1}
                        underlayColor = {'#ffffff'}>
                          <Icon
                            name = {this.state.favorited ? 'star' : 'star-o'}
                            size = {24}
                            color={colors.bitcampOrange}
                          />
                        </TouchableHighlight>
                      </View>
                    </View>
                    <Text style={styles.timeText}>
                      {
                        (this.props.startTimeFormatted) == (this.props.endTimeFormatted) ?
                        `${this.props.startTimeFormatted}`
                        :
                        `${this.props.startTimeFormatted} - ${this.props.endTimeFormatted}`
                      }
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

// this class displays the whole schedule by combining the day list, and event list
class ScheduleScene extends Component {

  constructor(props) {
    super(props);
    this.ds = scheduleData;

    this.state = {
       dataSource: this.ds.Schedule,
    };

    firebase.notifications().android.createChannel(channel);

    this.itemRef = firebase.database().ref();
    this.fetchPrelim = this.fetchPrelim.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this._renderScheduleTabs = this._renderScheduleTabs.bind(this);

  }

  // calls the methods to populate the data source
  componentDidMount() {
    // make sure we aren't overwriting Firebase data with locally cached data
    let timeoutObj = setTimeout(() => {this.fetchPrelim()}, 5000)
    this.fetchData(timeoutObj)

  }

  // this method either gets info from the phone or the hardcoded schedule stored in JSON
  fetchPrelim(){

    AsyncStorage.getItem(STORAGE_KEY, (err, result) => {
        if(result != null){
          this.ds = JSON.parse(result);
          this.setState({dataSource:this.ds.Schedule});
        }
        else{
          this.setState({datasource:scheduleData.Schedule});
        }
    });
  }

  // this method is called to obtain the schedule from firebase
  fetchData(timeoutObj){

    this.itemRef.on('value', async (snapshot) => {

      var data = snapshot.val();
      AsyncStorage.getItem(STORAGE_KEY, (err, result) => {
        
        clearTimeout(timeoutObj);
        //store new schedule on phone
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data), function(error){
          if (error){
            console.log(error);
          }
        });

        oldSchedule = result;
        newSchedule = JSON.stringify(data);

        this.ds = data;
        this.setState({dataSource:this.ds.Schedule});

        if(result != null && result != 'null'){
          // if we already had a schedule, correlate old stuff
          // this could take a while so we want to do it after showing state
          // hopefully the user does not try to add another schedule during this time

          result = JSON.parse(result);

          if(hash.MD5(oldSchedule) != hash.MD5(newSchedule)){
            this.updateScheduledNotifications(result.Schedule, data.Schedule);
          }

        }
      });

    })
  }

  // if the schedule changes, update the notifications
  updateScheduledNotifications(oldSchedule, newSchedule){
    //map event id's to epoch times in oldSchedule

    startTimes = {}
    for(let eventArray of oldSchedule){
      for(let eventObj of eventArray[1]){
        startTimes[eventObj.key] = eventObj.startTime;
      }
    }

    for(let eventArray of newSchedule){
      for(let eventObj of eventArray[1]){

        //start time for particular event was changed
        if(startTimes[eventObj.key] != null && startTimes[eventObj.key] != eventObj.startTime){
          console.log('Time change found for event id ' + eventObj.key.toString());
          AsyncStorage.getItem(EVENT_FAVORITED_KEY_PREFIX + eventObj.key.toString(),
            (err, result) => {
              if (err) {
                console.log(err);
              }
              if(result == 'true'){
                console.log("Updating notification time for " + eventObj.key.toString());
                //cancel current notification for this event id
                firebase.notifications().cancelNotification(EVENT_ID_PREFIX +  eventObj.key.toString());

                const notification = new firebase.notifications.Notification()
                  .setNotificationId(EVENT_ID_PREFIX + eventObj.key.toString())
                  .setTitle(eventObj.title)
                  .setBody('10 minutes until event start!')
                  .setData({
                    type: 'eventAlert'
                });

                this.customizeNotification(notification);
                this.scheduleNotification(notification, eventObj.startTime);


              }
            });
        }
      }
    }

  }

  // this creates a notification to our properties
  customizeNotification(notification){

    if (Platform.OS === 'android') {

      notification.android.setChannelId('test-channel');
      notification.android.setVibrate([100, 200, 100, 500]);
      notification.android.setCategory(firebase.notifications.Android.Category.Reminder);
      notification.android.setLights(16740159, 500, 100);
      notification.android.setColor('#FF6F3F')
    }
  }

  // this sets a notification
  scheduleNotification(notification, startTime){

    //use moment().add(10, 'seconds') to make it 10 seconds from now for testing
    //use moment(startTime).subtract(10, 'minutes') for actual time
    firebase.notifications().scheduleNotification(notification, {
      fireDate:  moment(startTime).subtract(10, 'minutes').valueOf()
    });
  }

  // renders each day for the top
  _renderScheduleTabs(){
    var thisBinded = this;
    return this.state.dataSource.
      map((scheduleForDay) => thisBinded._renderScheduleForDay(scheduleForDay))

  }

  // renders the schedule array
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

  // formats the time for each event
  normalizeTimeLabel(t){
    return moment(t).format("h:mm A")
  }

  // renders each row item for the event
  _renderRow(rowData) {
    return (
      <EventCard
        eventKey = {rowData.item.key}
        sizeLabel = {rowData.item.sizeLabel}
        title = {rowData.item.title}
        startTime = {rowData.item.startTime}
        endTime = {rowData.item.endTime}
        startTimeFormatted = {this.normalizeTimeLabel(rowData.item.startTime)}
        endTimeFormatted = {this.normalizeTimeLabel(rowData.item.endTime)}
        location = {rowData.item.location}
        description = {rowData.item.description}
        customizeNotification = {this.customizeNotification}
        scheduleNotification = {this.scheduleNotification}/>);
  }

  // renders all the lists and event rows
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
