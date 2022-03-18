import React, {useRef, useState, useEffect} from 'react';
import Navigation from '../navigation';
import { NavigationContainer,DefaultTheme} from '@react-navigation/native';
import SplashScreen from './SplashCreen';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux'
import SignInScreen from './SignInScreen'
import { createStackNavigator, HeaderBackground } from '@react-navigation/stack';
import {firebaseApp} from '../config/FirebaseConfig'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Platform} from 'react-native';
import * as themeUse from '../styles/BaseStyle'

const Stack = createStackNavigator();
async function getNotificationToken(){
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token
}
export default function MainScreen({ navigation }:any) {
    const userRedux = useSelector((state:any) => state.useReducer)
    const dispatch = useDispatch()
    const userRef = firebaseApp.database().ref('/users');

    const themeSelected = useSelector<any>((state:any) => state.theme.selectedTheme);
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor
    async function  onAuthStateChanged(user:any) {
      setTimeout(async function(){
        if(user == null){
          dispatch({ type: 'SIGN_OUT'})
        } else{
            dispatch({ type: 'SIGN_IN', userInfo: {
                email: user.email,
                id: user.uid,
                displayName: user.displayName 
            }})
            const tokenUser = await getNotificationToken()
            if(tokenUser){
              if(user && user.uid){
                firebaseApp.database().ref('/users/'+user.uid).update({token: tokenUser})
              }
            }
        }
      }, 1000)
    }
	
    
    React.useEffect(() => {
        const subscriber = firebaseApp.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);
    
    React.useEffect(() => {
        const onValueChange = userRef.on('value', (snapshot:any) => {
           let allUsers = snapshot.val()
           dispatch({ type: 'SET_ALL_USERS', allUser: allUsers})
        });
        return () => userRef.off('value', onValueChange);
    }, []);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
        <NavigationContainer>
            <Stack.Navigator>
            {userRedux.isLoading == 1 ? (
                // We haven't finished checking for the token yet
                <Stack.Screen name="HTMONEY" component={SplashScreen} 
                options={{
                  title: 'HT MONEY',
                  headerTintColor: textColor,
                  headerStyle: {
                    backgroundColor: backgroundColor,
                  },
              }}
                />
            ) : userRedux.userInfo == null ? (
                // No token found, user isn't signed in
                <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{
                        title: 'Đăng nhập',
                        headerTintColor: textColor,
                        headerStyle: {
                          backgroundColor: backgroundColor,
                        },
                    }}
                />
            ) : (
                // User is signed in
                <Stack.Screen name="Home" options={{headerShown: false}} component={Navigation} />
            )}
            </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaView>
    )
}