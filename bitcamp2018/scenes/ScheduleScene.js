import React, { Component } from 'react';

import {AppRegistry,
        View,
        Text,
        StyleSheet,
        FlatList,
        Image,
        AsyncStorage} from 'react-native';

import { List, ListItem} from "react-native-elements"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Accordion from './Accordion'
import moment from 'moment'

import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

import Icon from 'react-native-vector-icons/FontAwesome';
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
const downIcon = (<Icon name="chevron-down"/>);
const upIcon = (<Icon name="chevron-up"/>);
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

  render() {
    return (
      <ScrollableTabView
        tabBarPosition={'top'}
        style ={{flex: 1}}
        initialPage={0}
        keyExtractor = {(iterm, index) => index}
        tabBarUnderlineStyle = {{opacity: 0}}
      >
        {this._renderScheduleTabs()}
      </ScrollableTabView>
    );
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

    alteredData = JSON.parse(JSON.stringify(scheduleArray[1]));


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
    return (<FlatList
      tabLabel={scheduleArray[0]}
      data={alteredData}
      renderItem={this._renderRow}
      keyExtractor = {(item, index) => index}
    />)
  }


  normalizeTimeLabel(t){

    return moment(t).format("h:mm A")
  }

  _renderRow(rowData) {
    console.log(rowData.item.title);
    return (
      <View style = {{ flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    }}>
        <Text style = {{flex: 1}}>{rowData.item.sizeLabel}</Text>
        <Card style = {{flex: 4}}>
          <View style = {{ flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'}}>
            <View
              syle = {{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <CardImage>
                <Image
                  source={{uri: rowData.item.pictureUrl}}
                  style={
                    {width: 100,
                     height: 100,
                     resizeMode: "stretch",
                    }
                  }/>
              </CardImage>
            </View>
            <View style = {{ flex: 1, flexDirection: 'column'}}>
              <CardTitle>
                <Text>{rowData.item.title}</Text>
              </CardTitle>
              <CardContent>
                <Text>{rowData.item.startTime} - {rowData.item.endTime}</Text>
                <Text>{rowData.item.location}</Text>
                <Text>{rowData.item.description}</Text>
              </CardContent>
            </View>
          </View>
        </Card>
      </View>
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
