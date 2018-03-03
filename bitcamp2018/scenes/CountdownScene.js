import React, { Component } from 'react';
import { Text, Image, ImageBackground, View, Platform, Dimensions, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';

import { colors } from '../shared/styles';
import aleofy from '../shared/aleo';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const BoldAleoText = aleofy(Text, 'Bold');

const window = Dimensions.get('window');

// wraps a component with styles.shadow
function shadowify(Component) {
  return (props) => (
    <Component {...props} style={[styles.shadow, props.style]}>
      {props.children}
    </Component>
  );
}
const TimerText = shadowify(aleofy(Text, 'Bold'));

// A countdown to the event and then to end of hacking
class CountdownScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      totalPresses: 0,
      fill:100,
    };
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const eventTime      = new Date(2018, 4, 6, 22, 0, 0, 0); // when hacking begins
    const endHackingTime = new Date(2018, 4, 8, 10, 0, 0, 0);

    let numberStyles = styles.numbers;
    let remain;  // the time remaining until the next 'event' (either hacking begins or hacking ends)

    if (Platform.OS === "ios"){
      if (window.height/window.width < 1.7) numberStyles = styles.numbersIPad;
    }

    if (this.state.time <= eventTime) {
      remain = eventTime.getTime() - this.state.time.getTime();

    } else if (this.state.time > eventTime && this.state.time < endHackingTime) {
      remain = endHackingTime.getTime() - this.state.time.getTime();

    } else {
      remain = 0;
    }

    const days    = Math.floor((remain / 86400000));
    const hours   = Math.floor((remain % 86400000) / 3600000);
    const minutes = Math.floor((remain % 86400000 % 3600000) / 60000);
    const seconds = Math.floor((remain % 86400000 % 3600000 % 60000) / 1000);

    let daysText;
    let hoursText;
    let minutesText;
    let secondsText;
    if(days < 10){
      daysText = "0" + days;
    }else{
      daysText = "" + days;
    }
    if(hours < 10){
      hoursText = "0" + hours;
    }else{
      hoursText = "" + hours;
    }
    if(minutes < 10){
      minutesText = "0" + minutes;
    }else{
      minutesText = "" + minutes;
    }
    if(seconds < 10){
      secondsText = "0" + seconds;
    }else{
      secondsText = "" + seconds;
    }
    return (
      <View style={styles.scene}>
        <AnimatedCircularProgress
          size={350}
          width={15}
          fill={this.state.fill}
          tintColor="#FAAE44"
          backgroundColor="#FAAE44"
          rotation={0}
          style={styles.circle}>
          {
            (fill) => (
              <View>
                <Image
                  source={require('./images/flame.gif')}
                  style={styles.fire} 
                />
                <Image
                  source={require('./images/logs.png')}
                  style={styles.logs}
                />
              </View>
            )
          }
        </AnimatedCircularProgress>
        <View style={styles.row}>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{daysText}</TimerText>
            <TimerText style={styles.dhms}>D</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{hoursText}</TimerText>
            <TimerText style={styles.dhms}>H</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{minutesText}</TimerText>
            <TimerText style={styles.dhms}>M</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{secondsText}</TimerText>
            <TimerText style={styles.dhms}>S</TimerText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    marginBottom: 15,
  },
  fire: {
    height:150,
    width:150
  },
  logs: {
    height:65,
    width:150
  },
  fireBackground: {
    alignItems: 'center'
  },
  // text sizes
  shadow: {
    color: colors.DarkBrown,
    textAlign: 'center'
  },
  numbersIPad:{
    fontSize: 40,
    marginTop: 20,
    marginBottom: 10
  },
  numbers: {
    fontSize: 70,
  },
  dhms: {
    fontSize: 20
  },
  api: {
    fontSize: 25
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
});

export default CountdownScene;
