import React, { Component } from 'react';
import { View, ScrollView, Text, Image, Dimensions, ImageBackground } from 'react-native';
import PhotoView from 'react-native-photo-view';

const window = Dimensions.get('window');

function MapScene() {
  let styles = {
    width: window.width,
    height: window.height - 100,
  };

  return(
    <ImageBackground
      style={{
        flex: 1,
      }}
      source={require('./images/background.png')}
     >

      <PhotoView
        source={require('../assets/floor_plan_2018.png')}
        minimumZoomScale={0.9}
        maximumZoomScale={5}
        androidScaleType="fitCenter"
        style={styles} />
  </ImageBackground>
  );
}

export default MapScene;
