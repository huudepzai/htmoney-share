import * as React from 'react';
import { StyleSheet, Text, View, Pressable, Image, TextInput, TouchableOpacity, Platform, Alert, FlatList, Modal, TouchableHighlight, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';
import  firebase from 'firebase';
import { Entypo } from '@expo/vector-icons';

import imageList from "../imageList"
import  * as themeUse  from '../styles/BaseStyle';
import { AntDesign } from '@expo/vector-icons';
import 'moment-timezone';
import moment from 'moment'
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import {firebaseApp} from '../config/FirebaseConfig'
const InvestTask = createStackNavigator();
const InvestRef = firebaseApp.database().ref('/invest');
const InvestRefKey = (key:any) => firebaseApp.database().ref('/invest/'+key);

const BaseStyle = themeUse.default

export default function Invest() {
  return (
      <InvestTask.Navigator mode="modal" headerMode="none">
          <InvestTask.Screen name="MainInvest" component={MainTabInvestScreen} />
          <InvestTask.Screen name="AddInvestModal" component={AddInvestScreen} />
          <InvestTask.Screen name="HistoryInvest" component={HistoryInvest} />
      </InvestTask.Navigator>
  );
}

function MainTabInvestScreen({navigation}: any){
  const userRedux = useSelector((state:any) => state.useReducer);
  const [history, setHistory] = React.useState<any>([]);
  const [total, setTotal] = React.useState(0);
  const [totalProfit, setTotalProfit] = React.useState(0);
  const [isFinalization, setIsFinalization] = React.useState(0);
  const [typeSaving, setTypeSaving] = React.useState("dautu");

  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor  = themeUse.[themeSelected].textColor
  const textColorSub  = themeUse.[themeSelected].textColorSub
  const textColorUp  = themeUse.[themeSelected].upColor
  const textColorDown  = themeUse.[themeSelected].downColor

  useFocusEffect(
    React.useCallback(() => {
      const onValueChange = InvestRef
      .on('value', (snapshot:any) => {
        let data:any = snapshot.val();
        let dataFormat:any = [];
        let totalMoney = 0;
        let totalProfit = 0;
        if(data != null){
          let result =  Object.keys(data).sort((a:any, b:any) => (data[a].dateInvest > data[b].dateInvest) ? -1 : 1);
          result.forEach( function(key){
              if(data[key].finalization == isFinalization && data[key].typeSaving == typeSaving){
                let dateString = moment(data[key].dateInvest).format("YYYY-MM-DD");
                totalMoney = totalMoney + (isFinalization ? data[key].origionMoney : data[key].money);
                totalProfit =  totalProfit + data[key].profit;
                data[key].id = key;
                if(typeof dataFormat[dateString] == "undefined"){
                  dataFormat[dateString] = {
                    history: [data[key]],
                    totalMoney: data[key].money
                  } 
                } else{
                  dataFormat[dateString]['history'].push(data[key]);
                 dataFormat[dateString]['totalMoney'] = dataFormat[dateString]['totalMoney'] + data[key].money
                }
              }
          })
          setHistory(dataFormat);
          setTotal(totalMoney);
          setTotalProfit(totalProfit)
        }else{
          setHistory([]);
          setTotal(0);
          setTotalProfit(0)
        }
      })
      return () => InvestRef.off('value', onValueChange);
    }, [isFinalization, typeSaving])
  )
  
  return (
    <View style={{position: "relative", height: "100%",backgroundColor:backgroundColorHide}}>
       <View style={{flexDirection: "row", justifyContent: "center"}}>
       <TouchableOpacity onPress={()=> { setTypeSaving("dautu")}}  >
          <Text style={[typeSaving == "dautu" ? BaseStyle.active : {color: textColor}, { padding: 5, margin:5}]}>Đầu tư</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=> {setTypeSaving("thuhoi")}}  >
          <Text style={[typeSaving == "thuhoi" ?  BaseStyle.active : {color: textColor} , { padding: 5, margin: 5}]}>Thu hồi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> { setIsFinalization(0)}}  >
          <Text style={[isFinalization == 0 ? BaseStyle.active : {color: textColor}, { padding: 5, margin:5}]}>Đang đầu tư</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=> {setIsFinalization(1)}}  >
          <Text style={[isFinalization == 1 ?  BaseStyle.active : {color: textColor} , { padding: 5, margin: 5}]}>Tất toán</Text>
        </TouchableOpacity>
      </View>
      {
          total > 0 &&
          <View style={{backgroundColor: "#42cc42", marginTop: 15, marginBottom: 15, padding: 15, justifyContent: "center"}}>
            {
              isFinalization ? 
                <>
                <Text style={{color: "#fff", fontSize: 20, marginBottom: 10}} >
                  Đã tất toán: {String(total).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
                </Text>
                <Text style={{color: "#fff", fontSize: 20, marginBottom: 10}} >
                  Lãi: {String(totalProfit).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
                </Text>
                </>
              : <Text style={{color: "#fff", fontSize: 20, marginBottom: 10}} >
                  Tổng: {String(total).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
                </Text>
            }
          </View>
      }
      <Pressable onPress={() => navigation.navigate('AddInvestModal', {userInfo: userRedux.userInfo})} 
      style={{position: "absolute", top: 0, right: 10, zIndex: 10}}>
        <Ionicons size={50} style={{ marginBottom: 3 }} color="#ff0000" name="add-circle-sharp" />
      </Pressable>
      {
        Object.keys(history).length > 0 ?
          <FlatList
            data={Object.keys(history)}
            renderItem={({ item }) => <DetailInvest navigation={navigation} key={item} date={item} history={history[item]}   />}
            keyExtractor={(item, index)  => item}
          />
          :<Text style={{color:textColor}}>Không có dữ liệu</Text>
      }
    </View>
  )
}

function AddInvestScreen({navigation, route}: any){

  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor  = themeUse.[themeSelected].textColor
  const textColorSub  = themeUse.[themeSelected].textColorSub
  const textColorUp  = themeUse.[themeSelected].upColor
  const textColorDown  = themeUse.[themeSelected].downColor

  let InvestId = 0;
  let type = "add";

  if(typeof route.params != "undefined" && typeof route.params.InvestId != "undefined"){
    InvestId = route.params.InvestId;
  }
  
  if(typeof route.params != "undefined" && typeof route.params.type != "undefined"){
    type = route.params.type;
  }
  let ExchangeInfo:any = null;
  if(typeof route.params != "undefined" && typeof route.params.ExchangeInfo != "undefined"){
    ExchangeInfo = route.params.ExchangeInfo;
  }

  const [date, setDate] = React.useState(ExchangeInfo != null ? new Date(ExchangeInfo.dateInvest) : new Date());
  const [show, setShow] = React.useState(Platform.OS === 'ios');
  const userRedux = useSelector((state:any) => state.useReducer);
  const [money, setMoney] = React.useState(ExchangeInfo != null ? new Date(ExchangeInfo.money) :0);
  const [moneyFormat, setMoneyFormat] = React.useState(ExchangeInfo != null ? String(ExchangeInfo.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.') : "");
  const [note, setNote] = React.useState(ExchangeInfo != null ? new Date(ExchangeInfo.note) : "");
  const [person, setPerson] = React.useState(ExchangeInfo != null ? ExchangeInfo.person : "");
  const [typeSaving, setTypeSaving] = React.useState(ExchangeInfo != null ? ExchangeInfo.typeSaving : "dautu");
  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const saveInvest = () =>{
    if(money == 0 || (person == "" && (type == "add" || type == "update"))) {
      Alert.alert("Vui lòng nhập đủ thông tin!");
      return ;
    }
    if(InvestId==0){
      let history = [
        {
          content: "Đầu tư ban đầu",
          money: money,
          note: note,
          createAt: firebase.database.ServerValue.TIMESTAMP,
          updateAt: firebase.database.ServerValue.TIMESTAMP,
          uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
          dateInvest: date.getTime()
        }
      ]
      InvestRef.push({
        money: money,
        history: history,
        note: note,
        dateInvest: date.getTime(), 
        createAt: firebase.database.ServerValue.TIMESTAMP,
        updateAt: firebase.database.ServerValue.TIMESTAMP,
        uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
        origionMoney: money,
        endDateInvest: null,
        person: person,
        typeSaving: typeSaving,
        finalization: 0
      })
    } else{
      let content = "";
      let finalization  = 0;
      if(type == "addnew"){
        content = "Đầu tư thêm"
      } 
      if(type == "update"){
        content = "cập nhập"
      }
      if(type == "rut"){
        content = "rút một phần"
      }
      if(type == "tattoan"){
        content = "tất toán"
        finalization = 1
      }
      let history = {
          note: note,
          content: content,
          money: money,
          createAt: firebase.database.ServerValue.TIMESTAMP,
          updateAt: firebase.database.ServerValue.TIMESTAMP,
          uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
          dateInvest: date.getTime()
      }
      InvestRefKey(InvestId).once('value', (snapshot:any) => {
        let item = snapshot.val();
        let histories = item.history;
        let moneyUpdate = item.money;
        let profit = 0;
        switch(type){
          case "rut":
            moneyUpdate = moneyUpdate - money
          break;
          case "tattoan":
            moneyUpdate = 0
            profit = money - item.money
          break;
          case "update":
            moneyUpdate = moneyUpdate
          break;
          default: 
            moneyUpdate = moneyUpdate + money
          break;
        }
        histories.push(history);
        item.money = moneyUpdate,
        item.history = histories,
        item.updateAt = firebase.database.ServerValue.TIMESTAMP,
        item.note = type == "update" ? note : typeof item.note != "undefined" ? item.note: "",
        item.origionMoney = type == "update" ? money : item.origionMoney,
        item.finalization = finalization,
        item.profit = profit,
        item.dateInvest = item.dateInvest,
        item.endDateInvest = type == "tattoan" ? date.getTime() : null,
        item.person = type == "update" ? person : item.person,
        item.typeSaving = type == "update" ? typeSaving : item.typeSaving
        InvestRefKey(InvestId).update(item)
      })
    }
    setMoney(0);
    setMoneyFormat("");
    setDate(new Date());
    setNote("");
    navigation.navigate('MainInvest');
  }

  return (
    <View style={{backgroundColor: backgroundColor, padding: 15,height:'100%'}}>
      <View style={styles.item}>
        <Image style={BaseStyle.iconimg} source={imageList.icons.icon_75} />
        <TextInput
          placeholder="Số tiền giao dịch"
          value={moneyFormat}
          style={[styles.input,
            {backgroundColor:backgroundColor,color:textColor}
          ]}
          placeholderTextColor={textColor}
          keyboardType = 'numeric'
          onChangeText={(value)=>{
            setMoney(parseInt(value.replace(/\./g, "")));
            setMoneyFormat(value.replace(/\./g, "").replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.'));
          }}
        />
      </View>
      {
       ( type == "add" || type == "update" ) &&
      <>
      <View style={styles.item}>
        <AntDesign style={BaseStyle.iconimg} name="user" size={40} color={textColor} />
          <TextInput
            placeholder="Nguồn"
            value={person}
            style={[styles.input,
              {backgroundColor:backgroundColor,color:textColor}
            ]}
            placeholderTextColor={textColor}
            onChangeText={setPerson}
          />
      </View>
      <View style={styles.item}>
        <AntDesign style={BaseStyle.iconimg} name="book" size={40} color={textColor} />
        <TouchableOpacity onPress={()=> { setTypeSaving("dautu")}}  >
          <Text style={[typeSaving == "dautu" ? BaseStyle.active : {color: textColor}, { padding: 5, margin:5}]}>Đầu tư</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=> {setTypeSaving("thuhoi")}}  >
          <Text style={[typeSaving == "thuhoi" ?  BaseStyle.active : {color: textColor} , { padding: 5, margin: 5}]}>Thu hồi</Text>
        </TouchableOpacity>
      </View>
      </>
    }
      <View style={styles.item}>
          <AntDesign style={BaseStyle.iconimg} name="book" size={40} color={textColor} />
            <TextInput
              placeholder="Ghi chú"
              value={note}
              style={[styles.input,
                {backgroundColor:backgroundColor,color:textColor}
              ]}
              placeholderTextColor={textColor}
              onChangeText={setNote}
            />
      </View>
      <View style={styles.item}>
          <AntDesign style={BaseStyle.iconimg} name="calendar" size={40} color={textColor} />
          {!show &&<TouchableOpacity onPress={() => setShow(true)}  >
            {/* <Text>Hôm nay</Text> */}
            <Moment date={date} style={{marginLeft: 10,color:textColor}} element={Text} format="DD/MM/YYYY" />
            </TouchableOpacity> 
          }
          {show && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            style={{width: 320, backgroundColor: backgroundColor, marginLeft: 10}} 
            locale="vi"
          />)}
      </View>
      <View style={{flexDirection: "row", marginTop: 15, justifyContent: "center"}}>
        <TouchableOpacity onPress={() => {navigation.navigate('MainInvest')}} style={{ marginRight: 5}} >
          <Text  style={[{width: 150, paddingTop: 10, paddingBottom: 10, backgroundColor:"#ff0000",color: "#fff",fontSize: 20, textAlign:"center"}]}>Đóng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveInvest}>
              <Text  style={[{width: 150, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


function DetailInvest(props: any){
  let history = props.history.history;
  const allUser = useSelector((state:any) => state.useReducer.allUser);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [InvestId, setInvestId] = React.useState(0);
  const [exchangeInfo, setExchangeInfo] = React.useState([]);

  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor  = themeUse.[themeSelected].textColor
  const textColorSub  = themeUse.[themeSelected].textColorSub
  const textColorUp  = themeUse.[themeSelected].upColor
  const textColorDown  = themeUse.[themeSelected].downColor

  function deleteInvest(key:any){
    Alert.alert(
        "Bạn chắc chắn muốn xóa?",
        "",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => {
              setModalVisible(false);
              InvestRefKey(key).remove();
            }
          }
        ],
        { cancelable: false }
    );
  }
  return(
    <View style={{padding: 15, backgroundColor: backgroundColor, width: "100%", marginBottom: 10, borderRadius: 5, shadowOffset: {width: 0,height: 2}}}>
      <View style={styles.header}>
        <View style={{flexDirection: "row"}}>
          <Moment  locale="vi" format="dddd DD/MM/YYYY" element={Text} style={[styles.date, {flexGrow: 5,color: textColor}]} >{props.date}</Moment>
        </View>
      </View>
      {
        Object.keys(history).map((item:any, key:any)=>(
          <View key={key} style={{marginBottom: 10, marginTop: 15, flexDirection: "row"}}>
            <TouchableOpacity style={{flex: 5, paddingLeft: 5}} onPress={() => {props.navigation.navigate('HistoryInvest', {detail: history[key]})}}>
                <Text style={{fontSize: 15, color: textColor, fontWeight: "bold"}}>
                  <AntDesign name="user" size={20} color="green" /> {history[key].person}
                </Text>
                <Text style={{fontSize: 12, marginTop: 5, color: textColor}}>{history[key].note} {typeof allUser != 'undefined' 
                && typeof allUser[history[key].uid] != 'undefined' ? "by: " + allUser[history[key].uid].displayName : ""}</Text>
            </TouchableOpacity>
            {
              history[key].finalization == 1
              ? 
              <>
                <View style={{width: 150, alignItems: "flex-end"}}>
                  <Text style={{color:  "#ff0000", flexDirection: "row" }}><Text style={{width: 50}}>Gốc:</Text> {String(history[key].origionMoney).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
                  <Text style={{color:  "#ff0000", flexDirection: "row"  }}><Text style={{width: 50}}>Lãi:</Text>  {String(history[key].profit).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
                </View>
              </>
              : 
              <>
                <View style={{width: 100, alignItems: "flex-end"}}>
                  <Text style={{color:  "#ff0000" }}>{String(history[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
                </View>
              </> 
            }
            {
              history[key].finalization == 0 &&
              <TouchableOpacity onPress={()=>{
                setModalVisible(!modalVisible)
                setInvestId(history[key].id)
                setExchangeInfo(history[key])
                }} >
                  <Entypo name="dots-three-vertical" size={24} color={textColor} />
              </TouchableOpacity>
            }
          </View>
        ))
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              
              onPress={() => {
                setModalVisible(!modalVisible);
              }}><AntDesign name="close" size={24} color={textColor} />
              </TouchableOpacity>
              <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                props.navigation.navigate('AddInvestModal', {InvestId: InvestId, type: "addnew"})
              }}>
              <Text style={styles.modalText}>
                <AntDesign name="addfolder" size={24} color={textColor} /> Nhồi thêm
              </Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                props.navigation.navigate('AddInvestModal', {InvestId: InvestId, type: "rut"})
              }}>
            <Text style={styles.modalText}>
              <Entypo name="credit-card" size={24} color={textColor} /> Rút 1 phần
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                props.navigation.navigate('AddInvestModal', {InvestId: InvestId, type: "tattoan"})
              }}>
            <Text style={styles.modalText}>
              <AntDesign name="creditcard" size={24} color={textColor} /> Tất toán
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                props.navigation.navigate('AddInvestModal', {InvestId: InvestId, type: "update", ExchangeInfo: exchangeInfo})
              }}>
            <Text style={styles.modalText}>
              <AntDesign name="creditcard" size={24} color={textColor} /> Điều chỉnh số dư
            </Text>
            </TouchableOpacity>
         
            <TouchableOpacity onPress={()=>{ deleteInvest(InvestId)}} >
              <Text style={styles.modalText} >
                <AntDesign name="delete" size={24} color={textColor} /> Xoá
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    
  )
}

function HistoryInvest({navigation, route}: any){

  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor  = themeUse.[themeSelected].textColor
  const textColorSub  = themeUse.[themeSelected].textColorSub
  const textColorUp  = themeUse.[themeSelected].upColor
  const textColorDown  = themeUse.[themeSelected].downColor
  
  let detail = route.params.detail;
  let histories = route.params.detail.history;
  const allUser = useSelector((state:any) => state.useReducer.allUser);
  return(
    <ScrollView style={{padding: 10, width: "100%", marginBottom: 10, borderRadius: 5, shadowOffset: {width: 0,height: 2}}}>
      <View style={{padding: 15, marginBottom: 20, backgroundColor: "#fff", marginTop: 5}}>
        <TouchableOpacity onPress={() => {navigation.navigate('MainInvest')}} style={{ marginRight: 5}} >
          <AntDesign name="close" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={{fontSize: 15, color: textColor, fontWeight: "bold"}}>
          <AntDesign name="user" size={20} color="green" /> {detail.person}
        </Text>
        <View style={{flexDirection: "row", marginBottom: 5}}>
          <Text style={[styles.date]}>Ngày đầu tư: </Text>
          <Moment  locale="vi" format="DD/MM/YYYY" element={Text} style={[styles.date]} >{detail.dateInvest}</Moment>
        </View>
        <View>
        {
          detail.finalization == 1
          ? 
          <>
            <View style={{flexDirection: "row",  marginBottom: 5}}>
              <Text style={[styles.date]}>Ngày thu hồi: </Text>
              <Moment  locale="vi" format="DD/MM/YYYY" element={Text} style={[styles.date]} >{detail.endDateInvest}</Moment>
            </View>

            <View style={{marginBottom: 5, width: "100%"}}>
              <Text style={{color:  "#ff0000", flexDirection: "row", fontSize: 15, fontWeight: "bold"}}>
                <Text style={{width: 50}}>Gốc:</Text> {String(detail.origionMoney).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
              <Text style={{color:  "#ff0000", flexDirection: "row", fontSize: 15, fontWeight: "bold", marginTop: 5}}><Text style={{width: 50}}>Lời: </Text>  
                {String(detail.profit).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
              </Text>
            </View>
          </>
          : 
          <Text style={{color:  "#ff0000" , fontSize: 15, fontWeight: "bold", marginTop: 10}}>Tổng đầu tư: {String(detail.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
        }
        </View>
      </View>
      {
          Object.keys(histories).map( (item:any, key:any)=>(
          <View key={key} style={{padding: 15, backgroundColor: "#fff", width: "100%", marginBottom: 10, borderRadius: 5, shadowOffset: {width: 0,height: 2}}}>
            <View style={styles.header}>
              <View style={{flexDirection: "row"}}>
                <Moment  locale="vi" format="dddd DD/MM/YYYY" element={Text} style={[styles.date, {flexGrow: 5}]} >{histories[key].dateInvest}</Moment>
              </View>
            </View>

            <View  style={{flexDirection: "row"}}>
              <View style={{flex: 5, paddingLeft: 5}}>
                <Text style={{fontSize: 16}}>
                <AntDesign name="user" size={20} color="green" /> {typeof allUser != 'undefined' && typeof allUser[histories[key].uid] != 'undefined' ? allUser[histories[key].uid].displayName+": " : ""}
                  <Text >{histories[key].content.charAt(0).toUpperCase() + histories[key].content.slice(1)}</Text>
                </Text>
                <Text style={{fontSize: 12, marginTop: 5, color: "#333"}}>
                <AntDesign name="book" size={20} color="green" /> {histories[key].note}
                </Text>
              </View>

              <View style={{width: 100, alignItems: "flex-end"}}>
                <Text style={{color: histories[key].content == "tạo giao dịch" 
                  || histories[key].content == "tất toán" 
                  || histories[key].content == "rút một phần" ? "#ff0000" : "green", fontWeight: "bold"}}>
                  {String(histories[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
                </Text>
              </View>
            </View>

          </View>
        ))
      }
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10, 
    borderWidth: 1,
    borderColor: "#ccc",
    flexGrow: 5,
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  header:{
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10
  },
  date: {
    fontSize: 22,
    textTransform: "capitalize"
  },
  centeredView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: 'white',
    zIndex: 100
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
   fontSize: 20,
  }
});
