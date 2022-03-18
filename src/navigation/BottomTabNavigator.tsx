import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ExchangeScreen from '../screens/ExchangeScreen';
import TabReportScreen from '../screens/TabReportScreen';
import TabAddExchangeScreen from '../screens/TabAddExchangeScreen';
import TabAccountScreen from '../screens/TabAccountScreen';
import TabSavingScreen from '../screens/TabSavingScreen';
import {TabExchangeParamList, TabReportParamList, TabAccountParamList, TabSavingParamList, TabAddExchangeParamList } from '../types';
import  * as themeUse from '../styles/BaseStyle';
import { useSelector } from 'react-redux'

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
  return (
    <BottomTab.Navigator
      initialRouteName="Exchange"
      tabBarOptions={{ 
        activeTintColor: "#2f95dc",
        inactiveTintColor: textColor,
        activeBackgroundColor: backgroundColor,
        inactiveBackgroundColor: backgroundColor,
    }}
      >
      <BottomTab.Screen
        name="Giao dịch"
        component={TabExchangeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Báo cáo"
        component={TabReportNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Thêm mới"
        component={TabAddExchangeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="add-circle" color="green" />,
        }}
      />
      <BottomTab.Screen
        name="Tiết kiệm"
        component={TabSavingNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="rocket-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Tài khoản"
        component={TabAccountNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabExchangeStack = createStackNavigator<TabExchangeParamList>();

function TabExchangeNavigator() {
  return (
    <TabExchangeStack.Navigator>
      <TabExchangeStack.Screen
        name="ExchangeScreen"
        component={ExchangeScreen}
        options={{  headerShown: false }}
      />
    </TabExchangeStack.Navigator>
  );
}

const TabReportStack = createStackNavigator<TabReportParamList>();

function TabReportNavigator() {
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
  return (
    <TabReportStack.Navigator
    screenOptions={{
      headerTintColor: textColor,
      headerStyle: { backgroundColor: backgroundColor }
    }}
    >
      <TabReportStack.Screen
        name="TabReportScreen"
        component={TabReportScreen}
        options={{ headerTitle: '' }}
      />
    </TabReportStack.Navigator>
  );
}

const TabAccountStack = createStackNavigator<TabAccountParamList>();

function TabAccountNavigator() {
  return (
    <TabAccountStack.Navigator>
      <TabAccountStack.Screen
        name="TabAccountScreen"
        component={TabAccountScreen}
        options={{ headerTitle: 'Quản lý tài khoản', headerShown: false }}
      />
    </TabAccountStack.Navigator>
  );
}
const TabSavingStack = createStackNavigator<TabSavingParamList>();

function TabSavingNavigator() {
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
  return (
    <TabSavingStack.Navigator
    screenOptions={{
      headerTintColor: textColor,
      headerStyle: { backgroundColor: backgroundColor },
    }}
    >
      <TabSavingStack.Screen
        name="TabSavingScreen"
        component={TabSavingScreen}
        options={{ headerTitle: 'Tiết kiệm' }}
      />
    </TabSavingStack.Navigator>
  );
}
const TabAddExchangeStack = createStackNavigator<TabAddExchangeParamList>();

function TabAddExchangeNavigator() {
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
  return (
    <TabAddExchangeStack.Navigator
    screenOptions={{
      headerTintColor: textColor,
      headerStyle: { backgroundColor: backgroundColor },
    }}
    >
      <TabAddExchangeStack.Screen
        name="TabAddExchangeScreen"
        component={TabAddExchangeScreen}
        options={{ headerTitle: 'Thêm giao dịch' }}
      />
    </TabAddExchangeStack.Navigator>
  );
}
