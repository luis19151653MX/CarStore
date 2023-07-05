import { useCallback, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeBaseProvider, Box } from "native-base";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'YsabeauSC-Regular': require('./assets/fonts/YsabeauSC-Regular.ttf'),
  });

  const onFontsLoaded = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      onFontsLoaded();
    }
  }, [fontsLoaded, onFontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Box _text={{ fontFamily: 'YsabeauSC-Regular', fontSize: "2xl", color: "emerald.500" }}>Car Store</Box>
        <Text style={{ fontSize: 30 }}>Platform Default</Text>
      </View>
    </NativeBaseProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
