import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";
import { NativeBaseProvider, Box } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
      <Text>Electricar</Text>
      <Box _text={{fontSize:"2xl", color:"emerald.500"}}>Hello world</Box>
      <StatusBar style="auto" />
    </View>
      
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
