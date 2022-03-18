import * as React from 'react';
import {  Text, View, Pressable, Alert, Image, TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import 'moment-timezone';

import {firebaseApp} from '../../config/FirebaseConfig'
import  * as themeUse  from '../../styles/BaseStyle';
import { AntDesign } from '@expo/vector-icons';
import imageList from "../../imageList"
import {useSelector} from 'react-redux'

const BaseStyle = themeUse.default

const GroupRefKey = ((key:any) => firebaseApp.database().ref('/group/'+key));

export default function DetailGroup(props:any) {
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor
    const colorDown = themeUse.[themeSelected].downColor

    function deleteGroup(key:any){
        Alert.alert(
            "Bạn chắc chắn muốn xóa?",
            "",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () => GroupRefKey(key).remove() }
            ],
            { cancelable: false }
        );
    }
    let groupChilds = props.groupInfo.childs ? props.groupInfo.childs : [];
    return (
        <View style={{marginBottom: 5, marginTop: 5}}>
        <View style={[BaseStyle.detail]}>
            <Image style={{ width: 60,height: 60}} source={imageList.icons[props.groupInfo.info.icon]} />
            <Pressable style={BaseStyle.detailText} onPress={()=>{props.navigation.navigate('AddGroupModal', {groupInfo: props.groupInfo, groupList: props.groupList, id: props.id })}} >
                <Text style={{color:textColor}}>{props.groupInfo.info.groupName}</Text>
            </Pressable>
            <Pressable onPress={()=>{deleteGroup(props.id)}} >
                <AntDesign name="delete" size={24} color={colorDown} />
            </Pressable>
        </View>
        <View style={{ marginTop: 5}}>
            {Object.keys(groupChilds).length > 0 &&
                Object.keys(groupChilds).map( (key,index) => (
                <View style={{flexDirection: "row"}} key={key}>
                    <TextInput editable={false} style={{minWidth:10, height: 30, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: "#ccc"}} value="" />
                    <Image style={BaseStyle.iconimg} source={imageList.icons[groupChilds[key].info.icon]} />
                    <Pressable style={[BaseStyle.detailText, {paddingTop: 10}]} onPress={()=>{props.navigation.navigate('AddGroupModal', {groupInfo: groupChilds[key], groupList: props.groupList, id: key })}} >
                        <Text style={{color:textColor}}>{groupChilds[key].info.groupName}</Text>
                    </Pressable>
                    <Pressable onPress={()=>{deleteGroup(key)}} >
                        <AntDesign name="delete" size={24} color={colorDown} />
                    </Pressable>
                </View>
                ))
            }
        </View>
        </View>
    )
}