import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { colors } from '../shared/styles';
import aleofy from '../shared/aleo';

const BoldAleoText = aleofy(Text, 'Bold');

class ScheduleSceneTabBarOverlay extends Component {
  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const eachTabWidth = {
      width: containerWidth / numberOfTabs
    };

    return (
      <View style={[styles.tabs, this.props.style, ]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity key={tab}
              onPress={() => this.props.goToPage(i)}
              style={styles.tab}
              style={
                this.props.activeTab === i ?
                [styles.tab, styles.tabActive] : styles.tab
              }
            >
              <BoldAleoText
                style={
                  this.props.activeTab === i ? styles.activeText : styles.defaultText
                }
              >
                {tab}
              </BoldAleoText>
            </TouchableOpacity>
          );
        })}
        {/* Animated underline for active view is BROKEN FOR NOW */}
        {/* <Animated.View style={[styles.tabUnderlineStyle, eachTabWidth, ]} /> */}
      </View>
    );
  }
}

ScheduleSceneTabBarOverlay.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array
};

const styles = StyleSheet.create({
  tabUnderlineStyle: {
    position: 'absolute',
    height: 4,
    bottom: 0,
  },
  activeText: {
    fontSize: 16,
    color: colors.yellowOrange,
  },
  defaultText: {
    fontSize: 16,
    color: colors.mediumBrown,
    opacity: .8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        paddingBottom: 10,
      },
      android: {
        paddingBottom: 12,
      },
    }),
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabs: {
    // borderTopColor: colors.lightBrown,
    flexDirection: 'row',
    // paddingTop: 8,
    // borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
});

export default ScheduleSceneTabBarOverlay;
