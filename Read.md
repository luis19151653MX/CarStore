**Crear app**
## Npx create-expo-app car-store
**Instalar dependencias web**
## npx expo install react-native-web@~0.18.10 react-dom@18.2.0
## npx expo install @expo/webpack-config@^18.0.1

**Ejecutar en web y en android** 
## npx expo start
Para tener en ejecucion web y android. ejecutar npx expo start. Selecciona primero web (w)y despues android(a). esto sin detener el servidor


**Dependencias**
-->Native base
## npm install native-base
## expo install react-native-svg@12.1.1
## expo install react-native-safe-area-context@3.3.2
-->axios
--> Expo fonts
## npm install expo-splash-screen
## npx expo install expo-font (allow the app load the font)
-->Async Storage
## npx expo install @react-native-async-storage/async-storage
-->Audio
## npx expo install expo-av
--> React navigation
## npm install @react-navigation/native
## npx expo install react-native-gesture-handler react-native-reanimated
**opcionales en caso de error de navegacion:**
npm add react-native-reanimated
agregar  a babel config: plugins: ['react-native-reanimated/plugin'],
reiniciar el servidor: expo start --clear

--multiples tipos de navegación
## npm install @react-navigation/drawer
##  npm install @react-navigation/stack
## npm install @react-navigation/bottom-tabs
->top taps (delivery)
## npm install @react-navigation/material-top-tabs react-native-tab-view
## npx expo install react-native-pager-view
