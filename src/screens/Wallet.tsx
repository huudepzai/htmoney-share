import { HeaderBackground, StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {  Text, TouchableOpacity, View, Pressable, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux'

import {firebaseApp} from '../config/FirebaseConfig'
import * as themeUse from '../styles/BaseStyle';
const  BaseStyle  = themeUse.default

const WalletTask = createStackNavigator();
const walletRef = firebaseApp.database().ref('/wallet');
const walletRefKey = ((key:any) => firebaseApp.database().ref('/wallet/'+key));
export default function Wallet() {
	return (
        <WalletTask.Navigator mode="modal" headerMode="none">
            <WalletTask.Screen name="Main" component={WalletScreen} />
            <WalletTask.Screen name="AddWalletModal" component={AddWallerScreen} />
            <WalletTask.Screen name="EditWalletModal" component={EditWallerScreen} />
        </WalletTask.Navigator>
	);
}

function WalletScreen({navigation}: any) {
    const [walletList, setWalletList] = React.useState<any>([]);
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor

    React.useEffect(() => {
        const onValueChange = walletRef
          .on('value', (snapshot:any) => {
            setWalletList(snapshot.val())
          });
    
        // Stop listening for updates when no longer required
        return () =>
            walletRef
            .off('value', onValueChange);
    }, []);
      
    return (
        <View style={[BaseStyle.containerDetail,{backgroundColor: backgroundColorHide}]}>
            <TouchableOpacity onPress={() => navigation.navigate('AddWalletModal')} >
                <Ionicons size={40} style={{ marginBottom: 3 }} color="green" name="add-circle-sharp" />
            </TouchableOpacity>
            {
				Object.keys(walletList).length > 0 ?
				Object.keys(walletList).map( (key,index) => (
          <DetailWallet key={key} money={typeof walletList[key].money != "undefined" ? walletList[key].money : 0 }
            walletName={walletList[key].walletName} id={key} navigation={navigation} 
          />
				))
				: <Text>Chưa có dữ liệu</Text>
			}
        </View>
    )
}

function DetailWallet(props:any){
  const [walletList, setWalletList] = React.useState<any>([]);
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColorSub = themeUse.[themeSelected].textColorSub
  const textColor = themeUse.[themeSelected].textColor
  const textColorDown = themeUse.[themeSelected].downColor

    return (
        <View style={{flexDirection: "row"}}>
            <TouchableOpacity style={[BaseStyle.detailText, {paddingTop: 10}]}  onPress={()=>{props.navigation.navigate('EditWalletModal',
             {walletName: props.walletName, walletId: props.id, money: typeof props.money != "undefined" ? props.money : 0})}} >
                <Text style={{color:textColor}}>{props.walletName}</Text>
                <Text style={{color: textColorSub}}>Số dư {String(props.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{deleteWallet(props.id)}} >
                <AntDesign name="delete" size={24} color={textColorDown} />
            </TouchableOpacity>
        </View>
    )
}

function deleteWallet(key:any){
    Alert.alert(
        "Bạn chắc chắn muốn xóa?",
        "",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => walletRefKey(key).remove() }
        ],
        { cancelable: false }
    );
}

function AddWallerScreen({ navigation }: any) {
    const [walletName, setWalletName] = React.useState('');
    const [money, setMoney] = React.useState(0);
    const [moneyFormat, setMoneyFormat] = React.useState("");
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColorSub = themeUse.[themeSelected].textColorSub
    const textColor = themeUse.[themeSelected].textColor
    const textColorDown = themeUse.[themeSelected].downColor

    function saveWallet(){
        if(walletName == ''){
            Alert.alert('Vui lòng nhập tên ví');
            return;
        }
        walletRef.push({
            'walletName': walletName,
            'money': money
        })
        navigation.goBack();
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor:backgroundColorHide}}>
        <TextInput
          placeholder="Tên ví"
          value={walletName}
          style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
          placeholderTextColor={textColor}
          onChangeText={setWalletName}
		    />
        <TextInput
          placeholder="Số dư"
          value={moneyFormat}
          style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
          placeholderTextColor={textColor}
          keyboardType = 'numeric'
          onChangeText={(value)=>{
            setMoney(parseInt(value.replace(/\./g, "")));
            setMoneyFormat(value.replace(/\./g, "").replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.'));
          }}
        />
        <Pressable onPress={saveWallet} style={{flex: 1, alignItems: "center"}} >
          <Text  style={[{width: 200, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
        </Pressable>
      </View>
    );
}

function EditWallerScreen({navigation, route}: any) {
    const [walletName, setWalletName] = React.useState(route.params.walletName);
    const [money, setMoney] = React.useState(route.params.money);
    const [moneyFormat, setMoneyFormat] = React.useState(String(route.params.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.'));
    function saveWallet(){
        if(walletName == ''){
            Alert.alert('Vui lòng nhập tên ví');
            return;
        }
        walletRefKey(route.params.walletId).set({
            'walletName': walletName,
            'money': money
        })
        navigation.goBack();
    }
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const textColor = themeUse.[themeSelected].textColor
    return (
      <View style={{ flex: 1, alignItems: 'center',backgroundColor:backgroundColorHide}}>
        <TextInput
          placeholder="Tên ví"
          value={walletName}
          style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
          placeholderTextColor={textColor}
          onChangeText={setWalletName}
			  />
         <TextInput
          placeholder="Số dư"
          value={moneyFormat}
          style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
          placeholderTextColor={textColor}
          keyboardType = 'numeric'
          onChangeText={(value)=>{
            setMoney(parseInt(value.replace(/\./g, "")));
            setMoneyFormat(value.replace(/\./g, "").replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.'));
          }}
        />
        <Pressable onPress={saveWallet} style={{flex: 1, alignItems: "center"}} >
          <Text  style={[{width: 200, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
        </Pressable>
      </View>
    );
}