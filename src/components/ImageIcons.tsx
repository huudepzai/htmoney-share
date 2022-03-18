import * as React from 'react';
import { Text, View, Image, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import  BaseStyle  from '../styles/BaseStyle';
import imageList from "../imageList"
export default function ImageIcons(props:any) {
    let myloop:any = [];
    Object.keys(imageList.icons).map((item:any, key:any)=>{
        myloop.push(
        <TouchableOpacity key={key} onPress={() => props.onPress(item)}>
            <Image style={{width: 55, height: 55,margin: 5}} source={imageList.icons[item]} />
        </TouchableOpacity>
        )
    })
    return (
        <ScrollView>
            <View style={BaseStyle.iconimgList}>
                {myloop}
            </View>
        </ScrollView>
    )
}