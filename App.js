import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect,useState } from "react";
import { NativeBaseProvider, Box } from "native-base";
import { useFonts } from 'expo-font';


const App = () => {
  const [fontsLoaded] = useFonts({
    'YsabeauSC-Regular': require('./assets/fonts/YsabeauSC-Regular.ttf'),
  });
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) {
      setFontReady(true);
    }
  },[]);
  

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        {
          !fontReady ? (

            <Text>Cargando</Text>

          ) : (
            <Box _text={{ fontFamily: 'YsabeauSC-Regular', fontSize: "2xl", color: "emerald.500" }}>Car Store</Box>
          )
        }
      </View>
      <StatusBar style="auto" />

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

export default App;