import * as React from 'react';
import {  Text, TouchableOpacity, View, Pressable, Button, StyleSheet, TextInput, Alert, Modal,Image, ScrollView, SafeAreaView  } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux'
import firebase from 'firebase';
import Moment from 'react-moment'
import 'moment-timezone';
import { Ionicons } from '@expo/vector-icons';

import {firebaseApp} from '../config/FirebaseConfig'
import { AntDesign } from '@expo/vector-icons';
import imageList from "../imageList"
import ImageIcons from '../components/ImageIcons'
import Addgroup from '../components/groups/Addgroup'
import Detailgroup from '../components/groups/Detailgroup'

import * as themeUse from '../styles/BaseStyle';
const  BaseStyle  = themeUse.default


const GroupTask = createStackNavigator();
const GroupRef = firebaseApp.database().ref('/group');
const GroupRefKey = ((key:any) => firebaseApp.database().ref('/group/'+key));

export default function Group() {
	return (
        <GroupTask.Navigator mode="modal" headerMode="none">
            <GroupTask.Screen name="MainGroup" component={GroupScreen} />
            <GroupTask.Screen name="AddGroupModal" component={Addgroup} />
        </GroupTask.Navigator>
	);
}

function GroupScreen({navigation}: any) {
    const [groupList, setGroupList] = React.useState<any>([]);
	  const userRedux = useSelector((state:any) => state.useReducer);
    const [groupType, setGroupType] = React.useState("chi");

    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor

    React.useEffect(() => {
        const onValueChange = GroupRef
          .on('value', (snapshot:any) => {
            let data:any = [];
            let dataOrder:any = [];
            if(snapshot.val() != null){
              let result:any = snapshot.val();
              Object.keys(result).forEach( function(key){
                if(typeof result[key].parent != "undefined" && result[key].parent != ""){
                  if(typeof data[result[key].parent] != "undefined"){
                    data[result[key].parent]['childs'][key] = {
                      info: result[key]
                    } 
                  }else{
                    data[result[key].parent] = {
                      info : [],
                      childs: {
                        key: {
                          info: result[key]
                        }
                      }
                    }
                  }
                }else{
                  if(typeof data[key] != "undefined"){
                    data[key] = {info: result[key]}
                  }else{
                    data[key] = {
                      info : result[key],
                      childs: []
                    }
                  }
                }
              })
              //Sắp xếp lại dữ liệu
              if (Object.keys(data).length > 0){
                let orderKeys = Object.keys(data).sort((a:any, b:any) => typeof data[a].info.order == "undefined" ? -1 : 
                  typeof data[b].info.order == "undefined" ? 1 : (data[a].info.order > data[b].info.order) ? 1 : -1);
                orderKeys.forEach(function(key){
                  dataOrder[key] = data[key]
                  //Sắp xếp con
                  let dataChilds = data[key].childs
                  if (Object.keys(dataChilds).length > 0){
                    let dataChildOrder:any = []
                    let orderChildKeys = Object.keys(dataChilds).sort((a:any, b:any) => typeof dataChilds[a].info.order == "undefined" ? -1 : 
                      typeof dataChilds[b].info.order == "undefined" ? 1 : (dataChilds[a].info.order > dataChilds[b].info.order) ? -1 : 1);
                    orderChildKeys.forEach(function(keyChild){
                      dataChildOrder[keyChild] = dataChilds[keyChild]
                    })

                    dataOrder[key]['childs'] = dataChildOrder
                  }
                })
              }
              setGroupList(dataOrder);
            }
          });
        return () =>
            GroupRef
            .off('value', onValueChange);
        }, []);
        
    return (
        <View style={[BaseStyle.containerDetail,{backgroundColor: backgroundColorHide}]}>
            <View style={{padding: 1, flexDirection: 'row', marginBottom: 10}}>
              <Pressable onPress={() => navigation.navigate('AddGroupModal', {userInfo: userRedux.userInfo, groupList: groupList})} >
                <Ionicons size={40} style={{ marginBottom: 3 }} color="green" name="add-circle-sharp" />
              </Pressable>
              <Pressable onPress={() => setGroupType('chi')}>
                <Text style={[groupType == 'chi' ? BaseStyle.active : {color:textColor}, {fontWeight: "bold", padding: 5, marginTop: 7}]}>Khoản chi</Text>
              </Pressable>
              <Pressable onPress={() => setGroupType('thu')}>
                <Text style={[groupType == 'thu' ? BaseStyle.active : {color:textColor}, {fontWeight: "bold", padding: 5, marginTop: 7}]}>Khoản thu</Text>
              </Pressable>
					  </View>
            <ScrollView>
            {
              Object.keys(groupList).length > 0 ?
              Object.keys(groupList).map( (key,index) => (
                  groupList[key].info.groupType == groupType &&
                  <Detailgroup key={key} groupInfo={groupList[key]} groupList={groupList} createAt={groupList[key].createAt} id={key} navigation={navigation} />
              ))
              : <Text style={{color:textColor}}>Chưa có dữ liệu</Text>
            }
            </ScrollView>
        </View>
    )
}