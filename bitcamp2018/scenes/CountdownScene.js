import React, { Component } from 'react';
import { Text, Image, ImageBackground, View, Platform, Dimensions, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { colors } from '../shared/styles';
import aleofy from '../shared/aleo';
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
      time: moment(),
    };
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const eventTime      = moment("2018-04-06 07:00"); // when hacking begins
    const endHackingTime = moment("2018-04-08 12:00"); // when hacking ends

    let numberStyles = styles.numbers;
    let remain;  // the time remaining until the next 'event' (either hacking begins or hacking ends)

    if (Platform.OS === "ios"){
      if (window.height/window.width < 1.7) numberStyles = styles.numbersIPad;
    }

    let days;
    let hours;
    let minutes;
    let seconds;

    // If hacking is over
    if (this.state.time > endHackingTime) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;

    } else {
      // If hacking hasn't begun
      // Calculate time until hacking begins
      if (this.state.time <= eventTime) {
        remain = moment.duration(moment(eventTime).diff(moment(this.state.time)));
      // If hacking has begun
      // Calculate time until hacking finishes
      } else if (this.state.time > eventTime && this.state.time < endHackingTime) {
        remain = moment.duration(moment(endHackingTime).diff(moment(this.state.time)));
      }
      days    = remain.days();
      hours   = remain.hours();
      minutes = remain.minutes();
      seconds = remain.seconds();
    }

    let daysText = (days < 10) ? `0${days}` : `${days}`;
    let hoursText = (hours < 10) ? `0${hours}` : `${hours}`
    let minutesText = (minutes < 10) ? `0${minutes}` : `${minutes}`;
    let secondsText = (seconds < 10) ? `0${seconds}` : `${seconds}`;

    return (
        <ImageBackground
         style={styles.container}
         source={require('./images/background.png')}>

        <Image
          source={require('./images/flame.gif')}
          style={styles.fire}
        />
        <Image
          source={require('./images/logs.png')}
          style={styles.logs}
        />
        <View style={styles.row}>
          <TimerText style={styles.timerHeading}>Time Remaining</TimerText>
        </View>
        <View style={[styles.row, styles.timer]}>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{daysText}</TimerText>
            <TimerText style={styles.dhms}>days</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{hoursText}</TimerText>
            <TimerText style={styles.dhms}>hours</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{minutesText}</TimerText>
            <TimerText style={styles.dhms}>minutes</TimerText>
          </View>
          <TimerText style={numberStyles}>:</TimerText>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{secondsText}</TimerText>
            <TimerText style={styles.dhms}>seconds</TimerText>
          </View>
        </View>
        </ImageBackground>
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
    height:90,
    width:90
  },
  logs: {
    height:65,
    width:150,
  },
  fireBackground: {
    alignItems: 'center'
  },
  // text sizes
  shadow: {
    textAlign: 'center'
  },
  numbersIPad:{
    fontSize: 40,
    marginTop: 20,
    marginBottom: 10
  },
  timerHeading: {
    color: colors.yellowOrange,
    paddingTop: 40,
    fontSize: 20,
  },
  numbers: {
    fontSize: 44,
    color: colors.midnightBlue,
  },
  dhms: {
    fontSize: 14,
    color: colors.darkBrown,
  },
  api: {
    fontSize: 25
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
  },
  timer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
    alignItems:'center',
    justifyContent: 'center'
  }
});

export default CountdownScene;
