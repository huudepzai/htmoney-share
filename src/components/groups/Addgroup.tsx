import * as React from 'react';
import {  Text, View, Pressable, Button, TextInput, Alert, Modal,Image, ScrollView  } from 'react-native';
import { useSelector } from 'react-redux'
import firebase from 'firebase';
import 'moment-timezone';

import {firebaseApp} from '../../config/FirebaseConfig'
import  * as themeUse  from '../../styles/BaseStyle';
import  GroupStyle  from '../../styles/GroupStyle';
import ImageIcons from '../../components/ImageIcons'
import { AntDesign } from '@expo/vector-icons';
import imageList from "../../imageList"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';

const GroupRef = firebaseApp.database().ref('/group');
const GroupRefKey = ((key:any) => firebaseApp.database().ref('/group/'+key));
const BaseStyle = themeUse.default

export default function AddGroupScreen({ navigation, route }: any) {
    let groupList = route.params.groupList;
    let id = typeof route.params.id != "undefined" ? route.params.id : "";
    let groupInfo = null;
    if(typeof route.params.groupInfo != "undefined"){
        groupInfo = route.params.groupInfo.info;
    } 
    const [groupName, setGroupName] = React.useState(groupInfo != null ? groupInfo.groupName : "");
    const [groupType, setGroupType] = React.useState(groupInfo != null ? groupInfo.groupType : "chi");
    const [parrent, setParrent] = React.useState(groupInfo != null ? groupInfo.parent : "");
    const [order, setOrder] = React.useState((groupInfo != null && typeof groupInfo.order != "undefined") ? groupInfo.order : "");
    const [parrentName, setParrentName] = React.useState(groupInfo != null && groupInfo.parent != "" ? groupList[groupInfo.parent].info.groupName : "Nhóm cha");
    const [icon, setIcon] = React.useState(groupInfo != null ? groupInfo.icon : "icon_1");
		const userRedux = useSelector((state:any) => state.useReducer);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modaGroupParenlVisible, setModaGroupParenlVisible] = React.useState(false);

    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor

    function onPressImage(item:any){
      setModalVisible(false);
      setIcon(item);
	}
   // console.log(order)
    function saveGroup(){
        if(groupName == ''){
          return  Alert.alert('Vui lòng nhập tên nhóm');
        }
        if(order == ''){
          return  Alert.alert('Vui lòng nhập thứ tự');
        }
      
        if(id == ""){
            GroupRef.push({
                'groupName': groupName,
                'icon': icon,
                'orderId': parseInt(order),
                'uid': userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
                'createAt': firebase.database.ServerValue.TIMESTAMP,
                'parent': parrent,
                'groupType': groupType
            })
        } else{
            GroupRefKey(id).set({
                'groupName': groupName,
                'icon': icon,
                'order': parseInt(order),
                'uid': userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
                'createAt': firebase.database.ServerValue.TIMESTAMP,
                'parent': parrent,
                'groupType': groupType
            })
        }
        navigation.navigate('MainGroup');
    }

    return (
      <ScrollView style={{ backgroundColor: backgroundColorHide,paddingTop: 20, paddingLeft: 15, paddingRight: 15, height: "100%"}}>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
              style={{backgroundColor:backgroundColorHide}}
          >
              <View style={[GroupStyle.centeredView,{backgroundColor:backgroundColorHide}]}>
                  <View style={[GroupStyle.modalView,{backgroundColor:backgroundColorHide}]}>
                  <ImageIcons onPress={(item:any) => onPressImage(item)} style={{backgroundColor:backgroundColorHide}}/>
                  </View>
              </View>
          </Modal>

          <Modal
              animationType="slide"
              transparent={true}
              visible={modaGroupParenlVisible}
              onRequestClose={() => {
                setModaGroupParenlVisible(!modaGroupParenlVisible);
              }}
          >
              <View style={GroupStyle.centeredView}>
                  <ScrollView style={[GroupStyle.modalView,{backgroundColor:backgroundColor}]}>
                        <Pressable onPress={()=> {setParrent(""); setParrentName("Nhóm cha"); setModaGroupParenlVisible(false) }}>
                            <View style={[BaseStyle.detail]}>
                                <Image style={BaseStyle.iconimg} source={imageList.icons.icon_1} />
                                <Text style={{color:textColor}}>Không cha</Text>
                            </View>
                        </Pressable>
                    {
                      Object.keys(groupList).length > 0 &&
                      Object.keys(groupList).map( (key,index) => (
                        
													groupList[key].info.groupType == groupType &&
													<Pressable key={key} onPress={()=> {setParrent(key); setParrentName(groupList[key].info.groupName); setModaGroupParenlVisible(false) }}>
                            <View style={[BaseStyle.detail]}>
                                <Image style={BaseStyle.iconimg} source={imageList.icons[groupList[key].info.icon]} />
                                <Text style={{color:textColor}}>{groupList[key].info.groupName}</Text>
                            </View>
                        </Pressable> 
												
                      ))
                    }
                  </ScrollView>
              </View>
          </Modal>

          <View style={GroupStyle.item}>
            <Pressable
                onPress={() => setModalVisible(true)}
            >
            <Image style={BaseStyle.iconimg} source={imageList.icons[icon]} />
            </Pressable>
            <TextInput
              placeholder="Tên nhóm"
              value={groupName}
              style={[GroupStyle.input,
                {backgroundColor:backgroundColor,color:textColor}
              ]}
              onChangeText={setGroupName}
              placeholderTextColor={textColor}
            />
          </View>
          <View style={GroupStyle.item}>
            <Text style={{paddingTop: 15, paddingRight: 20,color:textColor}}>STT</Text>
            <TextInput
              value={order.toString()}
              style={[GroupStyle.input,
                {backgroundColor:backgroundColor,color:textColor}
              ]}
              placeholderTextColor={textColor}
              onChangeText={setOrder}
              keyboardType = 'numeric'
            />
          </View>
          <View style={{padding: 1, flexDirection: 'row', marginBottom: 10}}>
						<Pressable onPress={() => setGroupType('chi')}>
            	<Text style={[groupType == 'chi' ? BaseStyle.active : {color:textColor}, {fontWeight: "bold", padding: 5}]}>Khoản chi</Text>
            </Pressable>
						<Pressable onPress={() => setGroupType('thu')}>
            	<Text style={[groupType == 'thu' ? BaseStyle.active : {color:textColor}, {fontWeight: "bold", padding: 5}]}>Khoản thu</Text>
            </Pressable>
					</View>
          <View style={{padding: 1, flexDirection: 'row', marginBottom: 10}}>
            <View style={BaseStyle.iconimg}><AntDesign name="home" size={40} color={textColor} /></View>
            <Pressable
              	onPress={() => setModaGroupParenlVisible(true)}
            >
            <Text style={{fontWeight: "bold", marginLeft: 5, flexGrow: 2, paddingTop: 10,color:textColor}}>{parrentName}</Text>
            </Pressable>
          </View>
          <TouchableOpacity onPress={saveGroup} style={{alignItems: "center"}} >
            <Text  style={[{width: 200, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
          </TouchableOpacity>
      </ScrollView>
    );
}