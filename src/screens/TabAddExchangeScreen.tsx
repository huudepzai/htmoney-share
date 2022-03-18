import * as React from 'react';
import { Text, View } from 'react-native';
import AddExchange  from '../components/exchange/AddExchange';
import BaseStyle from '../styles/BaseStyle'
import { createStackNavigator } from '@react-navigation/stack';

const ExTask = createStackNavigator();
export default function TabAddExchangeScreen({navigation}: any) {
  return (
    <ExTask.Navigator mode="modal" headerMode="none">
        <ExTask.Screen name="MainEx" component={AddExchange} />
    </ExTask.Navigator>
  );
}