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
class Timer extends Component {

  state = {
    fill:100,
  }

  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      totalPresses: 0,
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

  _logoPress() {
    const eventTime = new Date(2017, 3, 7, 22, 0, 0, 0); // when hacking begins
    var presses = 0;
    if (new Date() > eventTime) {
      var presses = this.state.totalPresses + 1;
    }
    this.setState({
      totalPresses: presses,
    });
  }

  render() {
    const eventTime      = new Date(2017, 3, 7, 22, 0, 0, 0); // when hacking begins
    const endHackingTime = new Date(2017, 3, 9, 10, 0, 0, 0);

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
    return (
      <View style={styles.scene}>
        <AnimatedCircularProgress
          size={350}
          width={10}
          fill={100}
          tintColor="#FAAE44"
          backgroundColor="#FAAE44"
          rotation={0}>
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
            <TimerText style={numberStyles}>{days}</TimerText>
            <TimerText style={styles.dhms}>Days</TimerText>
          </View>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{hours}</TimerText>
            <TimerText style={styles.dhms}>Hours</TimerText>
          </View>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{minutes}</TimerText>
            <TimerText style={styles.dhms}>Minutes</TimerText>
          </View>
          <View style={styles.col}>
            <TimerText style={numberStyles}>{seconds}</TimerText>
            <TimerText style={styles.dhms}>Seconds</TimerText>
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
    textShadowColor: '#000000',
    textShadowOffset: {width: 0.1, height: 0.1},
    textShadowRadius: 5,
    color: colors.cloudWhite,
    textAlign: 'center'
  },
  numbersIPad:{
    fontSize: 40,
    marginTop: 20,
    marginBottom: 10
  },
  numbers: {
    fontSize: 40,
  },
  dhms: {
    fontSize: 15
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

export default Timer;
