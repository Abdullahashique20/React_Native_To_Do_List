

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToDOList from './src/toDoList';
import Splash from './src/splashScreen';

const Stack = createNativeStackNavigator();


function App() {


  return (
    // <View style={{ flex: 1 }}>
    //   <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Hiiiiiiiiiiiiiiii</Text>
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={Splash} />
        <Stack.Screen name='Todo' component={ToDOList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
