import * as React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Alert,FlatList, Modal, Platform, Dimensions} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import Moment from 'react-moment';
import 'moment/locale/vi';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from 'react-native';
import {firebaseApp} from '../config/FirebaseConfig'
import  * as themeUse from '../styles/BaseStyle';
import {addGroup, addFilter} from '../redux/action/exChange'
import imageList from "../imageList"
import Wallet from './Wallet';
import AddExchange  from '../components/exchange/AddExchange';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const GroupRef = firebaseApp.database().ref('/group');
const walletRef = firebaseApp.database().ref('/wallet');
const ExchangeRef = firebaseApp.database().ref('/exchange');
const ExchangeRefKey = (key:any) => firebaseApp.database().ref('/exchange/'+key);
const walletRefKey = (key:any) => firebaseApp.database().ref('/wallet/'+key);
const BaseStyle = themeUse.default

const ExTask = createStackNavigator();
export default function TabAddExchangeScreen({navigation}: any) {
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor
  return (
    <ExTask.Navigator 
    screenOptions={{
          headerTintColor: textColor,
          headerStyle: { backgroundColor: backgroundColor },
        }}
    >
        <ExTask.Screen name="MainExchangeScreen" component={ExchangeScreen}  options={{ headerTitle: "", headerShown: true }} />
        <ExTask.Screen name="EditExchange" component={AddExchange}  options={{ headerTitle: "Chỉnh sửa giao dịch", headerShown: true }} />
    </ExTask.Navigator>
  );
}

function ExchangeScreen({ navigation }:any) {
  const [modaWalletVisible, setModaWalletVisible] = React.useState(false);
  const [modaGroupTypeVisible, setModaGroupTypeVisible] = React.useState(false);
  const [walletList, setWalletList] = React.useState<any>([]);
  const [walletName, setWalletName] = React.useState('Tất cả ví');
  const [walletMoney, setWalletMoney] = React.useState('');
  const [history, setHistory] = React.useState<any>([]);
  const [selectedFill, setSelectedFill] = React.useState('thisMonth');
  const dispatch = useDispatch()
  const userInfo = useSelector((state:any) => state.useReducer);
  const [showStart, setShowStart] = React.useState(Platform.OS === 'ios');
  const [showEnd, setShowEnd] = React.useState(Platform.OS === 'ios');
  const [total, setTotal] = React.useState(0);
  const fillters = useSelector((state:any) => state.exChangeReducer.fillters);
  const [showImage, setShowImage] = React.useState(false);
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor

  React.useEffect(() => {
    if(typeof userInfo != "undefined" && typeof userInfo.userInfo != "undefined" && userInfo.userInfo != null){
      if(typeof userInfo.allUser != "undefined" && typeof userInfo.allUser[userInfo.userInfo.id] != "undefined"){
        fillters.walletId = userInfo.allUser[userInfo.userInfo.id].defaultWallet;
        dispatch(addFilter(fillters))
      }
    }
  }, [userInfo])
  
  React.useEffect(() => {
    const onValueChange = walletRef
      .on('value', (snapshot:any) => {
        let dataWallet = snapshot.val()
        setWalletList(dataWallet)
        if(typeof fillters.walletId != 'undefined' && fillters.walletId != ""){
          setWalletMoney(dataWallet[fillters.walletId].money)
          setWalletName(dataWallet[fillters.walletId].walletName)
        }
      });
    return () =>
        walletRef
        .off('value', onValueChange);
  }, [fillters.walletId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => setModaWalletVisible(true)}  style={{paddingLeft: 15}}>
            <Text style={{fontWeight: "bold",color:textColor}}>{walletName}</Text>
            { walletMoney != "" && <Text style={{color:textColor}}>{String(walletMoney).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}</Text>}
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => setModaGroupTypeVisible(true)} style={{paddingRight: 15}} >
          <Text style={{fontWeight: "bold", textTransform: "capitalize",color:textColor}} >{typeof fillters.groupType != "undefined" && fillters.groupType}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, walletName, fillters.groupType, walletMoney,themeSelected]);
  
  React.useEffect(() => {
    let startDate, endDate;
    setSelectedFill(fillters.selectedFill);
    switch(fillters.selectedFill){
      case 'thisMonth':
      case 'default':
        var d = new Date();
        var m = d.getMonth();
        var y = d.getFullYear();
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m+1, 0);
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;
      case 'option':
        var d = new Date();
        var m = d.getMonth();
        var y = d.getFullYear();
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m+1, 0);
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;
      case 'preMonth':
        var x = new Date();
        x.setDate(0); 
        endDate = x;
        startDate = new Date(x.getFullYear(), x.getMonth(), 1)
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;
      case 'thisYear':
        var d = new Date();
        var y = d.getFullYear();
        startDate = new Date(y, 0, 1);
        endDate = new Date(y, 11, 31);
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;
      case 'preYear':
        var d = new Date();
        var y = d.getFullYear() - 1;
        startDate = new Date(y, 0, 1);
        endDate = new Date(y, 11, 31);
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;
      case 'getAll':
        startDate = new Date(2010, 0, 1);
        endDate = new Date(2100, 11, 31);
        fillters.startDateFill = startDate;
        fillters.endDateFill = endDate;
        dispatch(addFilter(fillters))
      break;

    }
  }, [fillters.selectedFill]);

  useFocusEffect(
    React.useCallback(() => {
    fillters.startDateFill.setHours(0);
    fillters.startDateFill.setMinutes(0);
    fillters.startDateFill.setSeconds(0);
   
    fillters.endDateFill.setHours(23);
    fillters.endDateFill.setMinutes(59);
    fillters.endDateFill.setSeconds(59);
    const onValueChange = ExchangeRef
      .orderByChild('dateTrading')
      .startAt(fillters.startDateFill.getTime())
      .endAt(fillters.endDateFill.getTime())
      .on('value', (snapshot:any) => {
        let data:any = snapshot.val();
        let dataFormat:any = [];
        let totalMoney = 0;
        if(data != null){
          let result =  Object.keys(data).sort((a:any, b:any) => (data[a].dateTrading > data[b].dateTrading) ? -1 : 1);
          result.forEach( function(key){
            if(typeof data[key] != "undefined"){
              if(typeof fillters.groupType != "undefined" && data[key].groupType == fillters.groupType){
                if(typeof fillters.walletId == "undefined" 
                    || (typeof fillters.walletId != "undefined" && fillters.walletId == "")
                    || (typeof fillters.walletId != "undefined" && data[key].wallet == fillters.walletId)
                  ){
                  if(showImage){
                    if(!data[key].images || data[key].images.length == 0){
                      return
                    }
                  }
                  let dateString = moment(data[key].dateTrading).format("YYYY-MM-DD");
                  data[key].id = key;
                  if(typeof data[key].isNotShowReport == "undefined"){
                    totalMoney += data[key].money
                  }
                  if(typeof dataFormat[dateString] == "undefined"){
                    dataFormat[dateString] = {
                      history: [data[key]],
                      totalMoney: typeof data[key].isNotShowReport == "undefined" ? data[key].money : 0
                    } 
                  } else{
                    dataFormat[dateString]['history'].push(data[key]);
                    dataFormat[dateString]['totalMoney'] = typeof data[key].isNotShowReport == "undefined" ? (dataFormat[dateString]['totalMoney'] + data[key].money) : dataFormat[dateString]['totalMoney']
                  }

                }
              }
            }
          })
          setHistory(dataFormat);
          setTotal(totalMoney);
        }else{
          setTotal(0);
          setHistory([]);
        }
      });

    // Stop listening for updates when no longer required
    return () =>
        walletRef
        .off('value', onValueChange);
    }, [fillters.startDateFill, fillters.endDateFill, fillters.selectedFill, fillters.groupType, fillters.walletId,showImage])
  )

  React.useEffect(() => {
    const onValueChange = GroupRef
      .on('value', (snapshot:any) => {
        let data:any = [];
        if(snapshot.val() != null){
          dispatch(addGroup(snapshot.val()))
        }
      });
      return () =>
          GroupRef
          .off('value', onValueChange);
    }, []);

  const onChangeStart = (event:any, selectedDate:any) => {
    const currentDate = selectedDate;
    setShowStart(Platform.OS === 'ios');
    fillters.startDateFill = currentDate;
    dispatch(addFilter(fillters));
  };

  const onChangeEnd = (event:any, selectedDate:any) => {
    const currentDate = selectedDate;
    // setShow(Platform.OS === 'ios');
    setShowEnd(Platform.OS === 'ios');
    fillters.endDateFill = currentDate;
    dispatch(addFilter(fillters));
  };
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={[ {backgroundColor: themeUse.[themeSelected].backgroundColorHide, padding: 5,position:'relative',minHeight:'100%' }]}>
          <Picker
              mode="dropdown"
              style={[styles.onePicker,{backgroundColor:backgroundColor,color:textColor,borderColor:backgroundColorHide}]} itemStyle={[styles.onePickerItem,{color:textColor}]}
              selectedValue={selectedFill}
              onValueChange={(itemValue:any) =>{
                fillters.selectedFill = itemValue;
                dispatch(addFilter(fillters));
                setSelectedFill(itemValue);
              }
              }
            >
            <Picker.Item label="Tất cả" value="getAll" />
            <Picker.Item label="Tháng này" value="thisMonth" />
            <Picker.Item label="Tháng trước" value="preMonth" />
            <Picker.Item label="Năm nay" value="thisYear" />
            <Picker.Item label="Năm trước" value="preYear" />
            <Picker.Item label="Tuỳ chỉnh" value="option" />
          </Picker>
          {(fillters.selectedFill == 'option') &&
          <View>
            <View style={{marginTop: 10, flexDirection: "row"}}>
              <Text style={showStart && {paddingTop: 10, paddingRight: 10}}>From:</Text>
              {!showStart &&<TouchableOpacity onPress={() => setShowStart(true)}  >
              <Moment date={fillters.startDateFill} style={{marginLeft: 10}} element={Text} format="DD/MM/YYYY" />
              </TouchableOpacity> 
              }
              {
                showStart &&
                <DateTimePicker
                  value={fillters.startDateFill}
                  mode="date"
                  display="default"
                  onChange={onChangeStart}
                  style={{width: 320, backgroundColor: backgroundColor}} 
                  locale="vi"
                />
              }
            </View>
          
            <View style={{marginTop: 10, flexDirection: "row", marginBottom: 15}}>
              <Text style={showEnd && {paddingTop: 10, paddingRight: 10}}>To:</Text>
              {!showEnd &&<TouchableOpacity onPress={() => setShowEnd(true)}  >
              <Moment date={fillters.endDateFill} style={{marginLeft: 10}} element={Text} format="DD/MM/YYYY" />
              </TouchableOpacity> 
              }
              {
                showEnd &&
                <DateTimePicker
                  value={fillters.endDateFill}
                  mode="date"
                  display="default"
                  onChange={onChangeEnd}
                  style={{width: 320, backgroundColor: backgroundColor}} 
                  locale="vi"
                />
              }
            </View>
          </View>
        }
        {
          total > 0 &&
          <View style={{backgroundColor: "#42cc42", marginTop: 15, marginBottom: 15, padding: 15, justifyContent: "center"}}>
            <Text style={{color: "#fff", fontSize: 20, marginBottom: 10}} >Tổng {fillters.groupType == "chi" ? "thiệt hại: " : "thu hoạch"} 
            {String(total).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Báo cáo')}}>
              <Text style={{color: "#fff", fontSize: 20, }} >Xem báo cáo cho giai đoạn này</Text>
            </TouchableOpacity>
          </View>
        }
        {
          Object.keys(history).length > 0 ?
            <FlatList
              data={Object.keys(history)}
              renderItem={({ item }) => <DetailExchange navigation={navigation} key={item} date={item} history={history[item]}  walletList={walletList} />}
              keyExtractor={(item, index)  => item}
              style={{flex:1}}
            />
            // Object.keys(history).map((item:any, key:any)=>(
            //   <DetailExchange navigation={navigation} key={key} date={item} history={history[item]} />
            // ))
            :<Text>Không có dữ liệu</Text>
        }

        <Modal animationType="fade"
              transparent={true}
              visible={modaWalletVisible}
              onRequestClose={() => {
                setModaWalletVisible(!modaWalletVisible);
              }}
              style={{backgroundColor: backgroundColorHide, paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
          >
            <View style={[BaseStyle.centeredView,{backgroundColor:backgroundColorHide}]}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor:backgroundColorHide}]}>
              <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.walletId = ""; dispatch(addFilter(fillters)); setWalletMoney(""); setWalletName("Tất cả ví"); setModaWalletVisible(false)}}  >
                <Text style={{fontWeight: "bold",color:textColor}}>Tất cả ví</Text>
              </TouchableOpacity>
              {
                Object.keys(walletList).length > 0 &&
                Object.keys(walletList).map( (key) => (
                  <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.walletId = key; dispatch(addFilter(fillters)); setWalletMoney(walletList[key].money); setWalletName(walletList[key].walletName); setModaWalletVisible(false)}} key={key} >
                    <Text style={{fontWeight: "bold",color:textColor}}>{walletList[key].walletName}</Text>
                    <Text style={{color:textColor}}>{String(walletList[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
            </View>
          </Modal>
        <Modal animationType="fade"
              transparent={true}
              visible={modaGroupTypeVisible}
              onRequestClose={() => {
                setModaGroupTypeVisible(!modaGroupTypeVisible);
              }}
              style={{backgroundColor: "#fff", paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
          >
            <View style={BaseStyle.centeredView}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor: backgroundColorHide}]}>
              <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.groupType = "chi"; dispatch(addFilter(fillters)); setModaGroupTypeVisible(false)}}  >
                <Text style={{fontWeight: "bold",color:textColor}}>chi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.groupType = "thu";dispatch(addFilter(fillters)); setModaGroupTypeVisible(false)}}  >
                <Text style={{fontWeight: "bold",color:textColor}}>thu</Text>
              </TouchableOpacity>
            </ScrollView>
            </View>
          </Modal>
          <TouchableOpacity onPress={() => setShowImage(!showImage)} style={{position:"absolute",top: 90,right:30,zIndex:999999999}} >
              <AntDesign name="camera" size={24} color={!showImage ? "#888" : "#ff0000"} />
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

function DetailExchange(props: any){
  let history = props.history.history;
  let totalMoney = props.history.totalMoney;
  const exChangeState = useSelector((state:any) => state.exChangeReducer);
  const allUser = useSelector((state:any) => state.useReducer.allUser);
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  function deleteExchange(key:any, money:any, groupType:any, keyWallet:any, keyRelateId:any=null,relatedWallet:any=null){
    Alert.alert(
        "Bạn chắc chắn muốn xóa?",
        "",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => {
              ExchangeRefKey(key).remove();
              if(groupType =='chi'){
                groupType = 'thu'
              }else{
                groupType = 'chi'
              }
              updateMoneyWallet(keyWallet, money, groupType);
              if(keyRelateId!=null){
                  ExchangeRefKey(keyRelateId).remove();
              }
              if(relatedWallet!=null){
                console.log('relatedWallet',relatedWallet)
                  if(groupType == 'chi'){
                    updateMoneyWallet(relatedWallet, money, 'thu')
                  }else{
                    updateMoneyWallet(relatedWallet, money, 'chi')
                  }
              }
            }
          }
        ],
        { cancelable: false }
    );
  }
  return(
    <View style={{padding: 15, backgroundColor: themeUse.[themeSelected].backgroundColor, width: "100%", marginBottom: 10, borderRadius: 5, shadowOffset: {width: 0,height: 2}}}>
      <View style={styles.header}>
        <View style={{flexDirection: "row"}}>
          <Moment  locale="vi" format="dddd DD/MM/YYYY" element={Text} style={[styles.date, {flexGrow: 5,color:themeUse.[themeSelected].textColor}]} >{props.date}</Moment>
          <Text style={{color: themeUse.[themeSelected].textColor, fontWeight: "bold", textAlign: "right", flexGrow:5}}>{String(totalMoney).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
        </View>
        <Text style={{color:themeUse.[themeSelected].textColor}}>{Object.keys(history).length} giao dịch</Text>
      </View>
      {
        Object.keys(history).map((item:any, key:any)=>(
          <View key={key} style={{marginBottom: 10, marginTop: 15, flexDirection: "row"}}>
            {typeof exChangeState.groups[history[key].group] != "undefined"  ? 
              <Image style={BaseStyle.iconimg} source={imageList.icons[exChangeState.groups[history[key].group].icon]} /> : 
              <Image style={BaseStyle.iconimg} source={imageList.icons.icon_1} />
            }
            <TouchableOpacity style={{flex: 5, paddingLeft: 5}} onPress={() => props.navigation.navigate('EditExchange', {ExchangeInfo: history[key], id: history[key].id})}>
                {typeof exChangeState.groups[history[key].group] != "undefined"  ? 
                  <Text style={{fontSize: 16,color:themeUse.[themeSelected].textColor}}>{exChangeState.groups[history[key].group].groupName}</Text> 
                  :
                  typeof history[key].content != "undefined"  ? 
                  <Text style={{fontSize: 16,color:themeUse.[themeSelected].textColor}}>{history[key].content}</Text> 
                  :<Text></Text>
                }
                <Text style={{fontSize: 12, marginTop: 5, color: themeUse.[themeSelected].textColor}}>{history[key].note} {typeof allUser != 'undefined' && typeof allUser[history[key].uid] != 'undefined' ? "by: " + allUser[history[key].uid].displayName : ""}</Text>
            </TouchableOpacity>
            <View style={{width: 100, alignItems: "flex-end"}}>
              <Text style={{color: history[key].groupType == "chi" ? themeUse.[themeSelected].downColor : themeUse.[themeSelected].upColor, fontWeight: "bold"}}>{String(history[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
              <TouchableOpacity
                 onPress={()=>{deleteExchange(history[key].id, history[key].money, history[key].groupType, 
                  history[key].wallet,typeof history[key].relatedId!= 'undefined' ? history[key].relatedId  : null,
                  typeof history[key].relatedWallet != 'undefined' ? history[key].relatedWallet  : null
                  )
                }} 
                 >
                  <AntDesign name="delete" size={24} color={themeUse.[themeSelected].downColor} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      }
    </View>
  )
}

function updateMoneyWallet(id:any, money:number, type:string){
  walletRefKey(id)
  .once('value', (snapshot:any) => {
    let data = snapshot.val();
    console.log(data)
    let moneyUpdate = data.money;

    if(type == "chi"){
      moneyUpdate = moneyUpdate - money;
    }else {
      moneyUpdate = moneyUpdate + money;
    }
    walletRefKey(id).update({
      'money': moneyUpdate
    });
  });
}
const styles = StyleSheet.create({
  header:{
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 22,
    textTransform: "capitalize"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  onePicker: {
    width: "100%",
    height: 44,
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  onePickerItem: {
    height: 44,
    color: 'red'
  },
});
