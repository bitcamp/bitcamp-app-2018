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

import { colors } from './shared/styles';
import Icon from 'react-native-vector-icons/Ionicons';

class CustomTabBarOverlay extends Component {
  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const eachTabWidth = {
      width: containerWidth/numberOfTabs
    };
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
    });

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
              <Icon
                name={tab}
                size={28}
                color={this.props.activeTab === i ?
                  colors.yellowOrange : colors.lightBrown}
              />
            </TouchableOpacity>
          );
        })}
        {/* Animated underline for active view is BROKEN FOR NOW */}
        {/* <Animated.View style={[styles.tabUnderlineStyle, eachTabWidth, ]} /> */}
      </View>
    );
  }
}

CustomTabBarOverlay.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array
};

const styles = StyleSheet.create({
  tabUnderlineStyle: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.cloudWhite,
    bottom: 0,
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
    paddingTop: 10,
    borderTopColor: colors.cloudWhite,
    borderTopWidth: 4,
  },
  tabActive: {
    borderTopColor: colors.yellowOrange,
  },
  tabs: {
    // borderTopColor: colors.lightBrown,
    borderTopWidth: 0,
    height: 45,
    flexDirection: 'row',
    backgroundColor: colors.cloudWhite,
    // paddingTop: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
});

export default CustomTabBarOverlay;
