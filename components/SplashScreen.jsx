import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Animated,Text } from 'react-native';
import {Box} from "native-base";
import iconStore from '../assets/images/icon-store512.png';

const SplashScreen = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const interpolateRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.Image source={iconStore} style={[styles.logo, { transform: [{ rotate: interpolateRotation }] }]} />
      <Box _text={{fontFamily:'YsabeauSC-Regular', fontSize: "2xl", color: "emerald.500" }}>Car Store</Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#144c65',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  }
});

export default SplashScreen;
