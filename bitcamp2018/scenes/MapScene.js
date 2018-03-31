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
      style={{ flex: 1, }}
      source={require('./images/background.png')}
    >
      <PhotoView
        source={require('./images/floor_plan_final.png')}
        minimumZoomScale={0.9}
        maximumZoomScale={5}
        androidScaleType="fitCenter"
        style={styles}
      />
    </ImageBackground>
  );
}

export default MapScene;
