import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import ScheduleScene from './scenes/ScheduleScene';
import FaqScene from './scenes/FaqScene';
import MapScene from './scenes/MapScene';
// import MentorsScene from './scenes/MentorsScene';
import CountdownScene from './scenes/CountdownScene';

//credit to/documentation at
//https://github.com/skv-headless/react-native-scrollable-tab-view

import CustomTabBarOverlay from './CustomTabBarOverlay';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { colors } from './shared/styles';

import { isIphoneX } from 'react-native-iphone-x-helper'

export default function MenuTab(props) {

  // ios styles
  let menuTabPosition = 'bottom';
  let iconPrefix = 'md';
  let style = { flex: 1 };

  //{!iOS && (<MentorsScene     tabLabel={`${iconPrefix}-help-circle`} />)}
  //<MentorsScene     tabLabel={`${iconPrefix}-help-circle`} />

  let innerTabView = (<ScrollableTabView
    tabBarPosition={menuTabPosition}
    style={style}
    initialPage={0}
    locked = {true}
    renderTabBar={() => <CustomTabBarOverlay />}
    tabBarPosition="bottom"
    onChangeTab={(event) => {
      props.changeHeaderTitle(event.i)
    }}
  >
    <CountdownScene   tabLabel={`${iconPrefix}-home`} />
    <ScheduleScene    tabLabel={`${iconPrefix}-calendar`} />
    <FaqScene  tabLabel={`${iconPrefix}-information-circle`} />
    <MapScene         tabLabel={`${iconPrefix}-map`} />
    {/* <MentorsScene     tabLabel={`logo-twitter`} /> */}
  </ScrollableTabView>);

  if(isIphoneX()){
    return (<View style={{
      flex:1,
      paddingBottom: 34,
    }}>
      {innerTabView}
    </View>);
  }
  else {
    return (<View style={{
      flex:1,
    }}>
      {innerTabView}
    </View>);
  }
}
