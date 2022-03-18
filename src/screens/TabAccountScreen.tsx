import * as React from 'react';
import { StyleSheet, TouchableOpacity, ViewBase,Text, View} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux'
import {changeTheme} from '../redux/action/changeTheme'


import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import Wallet from './Wallet'
import Myprofile from './Myprofile'
import Group from './Group'
import Paybook from './Paybook'
import Invest from './Invest'
import {firebaseApp} from '../config/FirebaseConfig'
import {singOutUser} from '../redux/action/user'
import * as themeUse from '../styles/BaseStyle'

function singOut(){
    firebaseApp.auth().signOut()
    .then(() => singOutUser);
}

function AccountScreen({ navigation }:any){
  const dispatch = useDispatch()
  const themeSelected = useSelector<any>((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor = themeUse.[themeSelected].textColor
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={()=>{dispatch(changeTheme(themeSelected == 'light' ? 'dark' : 'light'))}}  style={{paddingLeft: 15}}>
            <Entypo name={themeSelected == 'light' ? 'moon' : 'light-up'} size={24} style={{paddingRight:10}} color={textColor}/>
        </TouchableOpacity>
      )
    });
  }, [navigation,themeSelected])
    return (
        <View style={{backgroundColor: backgroundColorHide, flex: 1, padding:10}}>
            <ShowMenu name="Quản lý ví" icon="wallet" goto="Wallet" onPress={() => navigation.navigate('Wallet')} />
            <ShowMenu name="Quản lý nhóm" icon="home"  onPress={() => navigation.navigate('Group')} />
            <ShowMenu name="Cập nhập thông tin cá nhân" icon="user" onPress={() => navigation.navigate('Myprofile')}  />
            <ShowMenu name="Sổ nợ" icon="book" onPress={() => navigation.navigate('Paybook')}  />
            <ShowMenu name="Đầu tư" icon="book" onPress={() => navigation.navigate('Invest')}  />
            <ShowMenu name="Đăng xuất" icon="logout" onPress={singOut}  />
        </View>
    )
}
export default function TabAcountScreen({ navigation }:any) {
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
    const Tab = createStackNavigator();
    return (
        <Tab.Navigator
        screenOptions={{
          headerTintColor: textColor,
          headerStyle: { backgroundColor: backgroundColor },
        }}
        >
            <Tab.Screen name="Account" component={AccountScreen} options={{ headerTitle: 'Quản lý tài khoản' }} />
            <Tab.Screen name="Wallet" component={Wallet} options={{ headerTitle: 'Quản lý tài ví' }} />
            <Tab.Screen name="Group" component={Group} options={{ headerTitle: 'Quản lý nhóm' }} />
            <Tab.Screen name="Myprofile" component={Myprofile} options={{ headerTitle: 'Thông tin cá nhân' }} />
            <Tab.Screen name="Paybook" component={Paybook} options={{ headerTitle: 'Sổ nợ' }} />
            <Tab.Screen name="Invest" component={Invest} options={{ headerTitle: 'Đầu tư' }} />
        </Tab.Navigator>
    );
}

function ShowMenu(props:any){
    const colorScheme = useColorScheme();
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor
    const {onPress}  = props;
    return (
        <TouchableOpacity onPress={onPress} >
            <View style={{padding: 1, flexDirection: 'row', marginBottom: 10}}>
                <AntDesign name={props.icon} size={24} color={themeUse.[themeSelected].textColor} />
                <Text style={{paddingLeft: 15, paddingTop: 3, fontSize: 16, color: textColor}}>{props.name}</Text>
            </View>
        </TouchableOpacity>
    )
}