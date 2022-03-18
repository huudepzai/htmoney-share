import * as React from 'react';
import { Text, View, Image, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import  styles  from '../styles';
export default function ImageIcons(props:any) {
    let myloop = [];
    for(let i = 1; i <= 143; i++){
        myloop.push(<TouchableOpacity key={i} onPress={() => props.onPress(i)}><Image
            style={styles.iconimg}
            source={{
                uri: `https://static.moneylover.me/img/icon/icon_${i}.png`,
            }}
        /></TouchableOpacity>)
    }
    return (
        <ScrollView>
            <View style={styles.iconimgList}>
                {myloop}
            </View>
        </ScrollView>
    )
}