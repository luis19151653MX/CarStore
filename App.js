import { useCallback, useEffect,useState  } from 'react';
import { NativeBaseProvider,extendTheme } from "native-base";
import { ContextProvider } from './context/AppContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import Main from "./components/MainNavigation";
import CustomSplashScreen from './components/sharecomponents/SplashScreen';

export default function App() {

  //native base config and theme
  const theme = extendTheme({
    colors: {
      // Add new color
      ligthmode: {
        bg: '#ffffff',
        accent: '#0E7490',
        text: "#000",
        btnText: '#fff',
        input: "#7dc0ff",
        darkBlue: "#0E7490",
        red:"#CC3304"
      },
      //dark blue 50
      darkmode: {
        bg: '#000000',
        accent: '#FFC80F',
        text: "#fff",
        btnText: "#000"
      }
    }
  });

  const config = {
    dependencies: {
      initialColorMode: 'dark'
    }
  };
  

  //splash screen time 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 30); // 5000 ms = 5 seconds
  }, []);


  //google fonts
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
    <NativeBaseProvider theme={theme} config={config} >
      <ContextProvider>
        {
        loading ? <CustomSplashScreen/>:<Main/>
      }
      </ContextProvider>
    </NativeBaseProvider>

  );
}

