import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {View} from 'react-native'
import useCachedResources from './src/hooks/useCachedResources';
import * as Notifications from 'expo-notifications';

import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import { Provider as StoreProvider } from 'react-redux'
import configureStore from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'


const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const { persistor, store } = configureStore()
export default function App({ navigation }:any) {
	return (
      <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <SafeAreaProvider> */}
          <MainScreen />
        {/* </SafeAreaProvider> */}
      </PersistGate>
      <StatusBar style="light" backgroundColor="#333" />
      </StoreProvider >
	);
}