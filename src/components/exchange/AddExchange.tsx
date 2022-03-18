import * as React from 'react';
import {  Button,Text, View, Pressable, TouchableOpacity, TextInput, Alert, Modal,Image, ScrollView,Platform, Dimensions } from 'react-native';
import { useSelector } from 'react-redux'
import  firebase from 'firebase';
import 'moment-timezone';
import Moment from 'react-moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment'
import 'moment/locale/vi';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import ImageScale from 'react-native-scalable-image';

import {firebaseApp} from '../../config/FirebaseConfig'
import   * as themeUse   from '../../styles/BaseStyle';
import  GroupStyle  from '../../styles/GroupStyle';
import imageList from "../../imageList"
import SwipeGesture from '../swipe-gesture'
import { color } from 'react-native-reanimated';

const GroupRef = firebaseApp.database().ref('/group');
const walletRef = firebaseApp.database().ref('/wallet');
const walletRefKey = (key:any) => firebaseApp.database().ref('/wallet/'+key);
const ExchangeRef = firebaseApp.database().ref('/exchange');
const ExchangeRefKey = (key:any) => firebaseApp.database().ref('/exchange/'+key);
const deviceWidth = Dimensions.get('window').width

const BaseStyle = themeUse.default

export default function AddExchange({ navigation, route }: any) {
    const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
    const [procgressPercent,setProcgressPercent] = React.useState<any>(0);
    const [isUploading,setIsuploading] = React.useState<boolean>(false);
    const openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (pickerResult.cancelled === true) {
        return;
      } else{
        setIsuploading(true)
        setProcgressPercent(0)
        let uri = pickerResult.uri
        let response = await fetch(uri);
        let blob = await response.blob();
        let fileName = uri.substr(uri.lastIndexOf('/') + 1);
        uploadFile(blob,fileName)
      }
    }
    const removeImage = async () => {
      let imagesUpdate = images
      await imagesUpdate.splice(selectedImage)
      await setImages(imagesUpdate)
      setSelectedImage(0)
      setModalImage(false)
    }
    let ExchangeInfo:any = null;
    if(typeof route.params != "undefined" && typeof route.params.ExchangeInfo != "undefined"){
      ExchangeInfo = route.params.ExchangeInfo;
    }
    const [money, setMoney] = React.useState(ExchangeInfo != null ? ExchangeInfo.money : 0);
    const [moneyFormat, setMoneyFormat] = React.useState(ExchangeInfo != null ? String(ExchangeInfo.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.') : "");
    const [note, setNote] = React.useState(ExchangeInfo != null ? ExchangeInfo.note : "");
    const [groupList, setGroupList] = React.useState<any>([]);
	  const userRedux = useSelector((state:any) => state.useReducer);
    const [groupType, setGroupType] = React.useState(ExchangeInfo != null ? ExchangeInfo.groupType : "chi");
    const [group, setGroup] = React.useState(ExchangeInfo != null ? ExchangeInfo.group : "");
    const [groupName, setGroupName] = React.useState(ExchangeInfo != null && typeof groupList[ExchangeInfo.group] != "undefined" ? groupList[ExchangeInfo.group].info.groupName : "Chọn danh mục");
    const [modaGroupVisible, setModaGroupVisible] = React.useState(false);
    const [modaWalletVisible, setModaWalletVisible] = React.useState(false);
    const [modaWalletVisibleRecei, setModaWalletVisibleRecei] = React.useState(false);
    const [modalImage, setModalImage] = React.useState(false);
    const [date, setDate] = React.useState(ExchangeInfo != null ? new Date(ExchangeInfo.dateTrading) : new Date());
    const [show, setShow] = React.useState(Platform.OS === 'ios');
    const [walletList, setWalletList] = React.useState<any>([]);
    const [Wallet, setWallet] = React.useState(ExchangeInfo != null ? ExchangeInfo.wallet : '');
    const [WalletName, setWalletName] = React.useState('Chọn ví');

    const [WalletRecei, setWalletRecei] = React.useState(ExchangeInfo != null ? ExchangeInfo.wallet : '');
    const [WalletReceiName, setWalletReceiName] = React.useState('Chọn ví nhận');
    const [iconGroup, setIconGroup] = React.useState('icon_1');
    const [images,setImages] = React.useState<any>(ExchangeInfo != null ? ExchangeInfo.images  ? ExchangeInfo.images  : [] : [])
    const [selectedImage, setSelectedImage] = React.useState<number>(0);
    const [calcheight, setCalcheight] = React.useState<number>(0);
    const [relatedId, setRelatedId] = React.useState((ExchangeInfo != null && ExchangeInfo.relatedId) ? ExchangeInfo.relatedId : null);
    //Thiết lập ví mặc định
    React.useEffect(() => {
      //console.log(userRedux);
      if(typeof userRedux != "undefined" && ExchangeInfo == null){
        if(typeof userRedux.allUser != "undefined" && typeof userRedux.allUser[userRedux.userInfo.id] != "undefined"){
          setWallet(userRedux.allUser[userRedux.userInfo.id].defaultWallet);
        }
      }
    }, [userRedux])
    React.useEffect(() => {
        const onValueChange = GroupRef
          .on('value', (snapshot:any) => {
            let data:any = [];
            let dataOrder:any = [];
            let result:any = [];
            if(snapshot.val() != null){
              result = snapshot.val();
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
            }
			      //setGroupList(data)
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
            if(ExchangeInfo != null && typeof result[ExchangeInfo.group] != "undefined"){
              setGroupName(result[ExchangeInfo.group].groupName);
              setIconGroup(result[ExchangeInfo.group].icon);
            }

          });
        return () =>
            GroupRef
            .off('value', onValueChange);
        }, []);
    
      React.useEffect(() => {
        const onValueChange = walletRef
          .on('value', (snapshot:any) => {
            let dataWalletList = snapshot.val();
            setWalletList(dataWalletList)
            if(Wallet != ""){
              setWalletName(dataWalletList[Wallet].walletName);
            }
          });
    
        // Stop listening for updates when no longer required
        return () =>
            walletRef
            .off('value', onValueChange);
    }, [Wallet]);
    const onChange = (event:any, selectedDate:any) => {
      const currentDate = selectedDate || date;
     // setShow(Platform.OS === 'ios');
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
    };
    const uploadFile = (file:any,name:string) => {
      const ref = firebaseApp.storage().ref().child('images/'+name);
      let uploadTask = ref.put(file);
      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProcgressPercent(Math.round(progress/100))
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        Alert.alert('Không up được ảnh gọi ông Hữu')
        setIsuploading(false)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImages([...images,downloadURL])
        });
        setIsuploading(false)
      }
      )
    }
 

    async function saveExchange(){
      if(money == 0 || Wallet == '' || (group == '' && groupType!=='chuyentien') ||  (WalletRecei == '' && groupType==='chuyentien')){
        return  Alert.alert('Vui lòng nhập đầy đủ thông tin');
      }
      let dataUpdate:any = {
        money: money,
        groupType: groupType,
        dateTrading: date.getTime(),
        wallet: Wallet,
        group: group,
        note: note,
        createAt: firebase.database.ServerValue.TIMESTAMP,
        updateAt: firebase.database.ServerValue.TIMESTAMP,
        uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
        images: images
      }
      if(typeof route.params != "undefined" && typeof route.params.id != "undefined"){
        if(groupType !== 'chuyentien'){
          delete dataUpdate["createAt"];
          delete dataUpdate["uid"];
          ExchangeRefKey(route.params.id).update(dataUpdate, (error:any) => {
            if (error) {
              Alert.alert('Lỗi không mong muốn!')
            } else {
              //Cập nhập số dư ví
              const oldMoney = ExchangeInfo.money;
              const oldGroupType = ExchangeInfo.groupType;
              const oldWallet = ExchangeInfo.wallet;
              if(oldWallet != Wallet){
                //Xoá ví cũ
                if(oldGroupType == "chi"){
                  updateMoneyWallet(oldWallet, oldMoney, "thu");
                } else{
                  updateMoneyWallet(oldWallet, oldMoney, "chi");
                }
                //Cập nhập ví mới
                updateMoneyWallet(Wallet, money, groupType);
              } else{
                if(oldGroupType == groupType){
                  updateMoneyWallet(Wallet, money - oldMoney, groupType);
                } else{
                  if(oldGroupType == "chi"){
                    updateMoneyWallet(Wallet, oldMoney, "thu");
                  } else{
                    updateMoneyWallet(Wallet, oldMoney, "chi");
                  }
                  updateMoneyWallet(Wallet, money, groupType);
                }
              }
              setMoney(0);
              setMoneyFormat("");
              setNote("");
              setGroupType("chi");
              setShow(false);
              setWallet("")
              setWalletName("Chọn ví")
              setGroup("")
              setGroupName("Chọn danh mục")
              navigation.navigate('MainExchangeScreen');
            }
          });
          
        } else{
     
          //Xử lý logic chuyển tiền từ Ví này sang ví kia
          //Tạo 2 giao dịch 1 giao dịch trừ tiền, 1 giao dịch cộng tiền
          //Add field isNotShowReport = true để không hiển thị báo cáo
          // let dataUpdate1 = {
          //   money: money,
          //   groupType: groupType,
          //   dateTrading: date.getTime(),
          //   wallet: Wallet,
          //   content: `Chuyển tiền ${WalletName} sang ${WalletName}`,
          //   note: note,
          //   updateAt: firebase.database.ServerValue.TIMESTAMP,
          //   images: images
          // }
 
          // ExchangeRefKey(route.params.id).update(dataUpdate1, (error:any) => {
          //   if (error) {
          //     Alert.alert('Lỗi không mong muốn!')
          //   } else {
          //     //Cập nhập số dư ví
          //     const oldMoney = ExchangeInfo.money;
          //     const oldWallet = ExchangeInfo.wallet;
          //     const oldWalletRecei = ExchangeInfo.WalletRecei;
          //     if(oldWallet != Wallet){
          //       //Xoá ví cũ
          //       updateMoneyWallet(oldWallet, oldMoney, "thu");
          //       //Cập nhập ví mới
          //       updateMoneyWallet(Wallet, money, 'chi');
          //     } else{
          //       updateMoneyWallet(Wallet, oldMoney, "thu");
          //       updateMoneyWallet(Wallet, money, 'chi');
          //     }
              
          //     if(oldWalletRecei != WalletRecei){
          //       //Xoá ví cũ
          //       updateMoneyWallet(oldWalletRecei, oldMoney, "chi");
          //       //Cập nhập ví mới
          //       updateMoneyWallet(WalletRecei, money, 'thu');
          //     } else{
          //       updateMoneyWallet(WalletRecei, oldMoney, "chi");
          //       updateMoneyWallet(WalletRecei, money, 'thu');
          //     }
          //     setMoney(0);
          //     setMoneyFormat("");
          //     setNote("");
          //     setGroupType("chi");
          //     setShow(false);
          //     setWallet("")
          //     setWalletName("Chọn ví")
          //     setGroup("")
          //     setGroupName("Chọn danh mục")
          //     navigation.navigate('MainExchangeScreen');
          //   }
          // });

        }
      } else{
        if(groupType !== 'chuyentien'){
          ExchangeRef.push(dataUpdate, (error:any) => {
            if (error) {
              Alert.alert('Lỗi không mong muốn!')
            } else {
              //Tạo thông báo cho haoai
              if(typeof userRedux != "undefined" && ExchangeInfo == null){
                if(typeof userRedux.allUser != "undefined"){
                  let mesages:any = [];
                  Object.keys(userRedux.allUser).forEach( function(key){
                    if(key != userRedux.userInfo.id){
                      if(typeof userRedux.allUser[key].token != "undefined" && userRedux.allUser[key].token != ""){
                        mesages.push({
                          "to": userRedux.allUser[key].token,
                          "sound": "default",
                          "title": "Giao dịch mới",
                          "body": userRedux.allUser[userRedux.userInfo.id].displayName+ " thêm giao dịch mới trong "+groupName
                          +"\nNgày: "+moment(dataUpdate.dateTrading).format("YYYY-MM-DD")+' - Giá trị: '+String(dataUpdate.money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')+"₫"
                        })
                      }
                    }
                  })
                  fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      'Accept-encoding': 'gzip, deflate',
                    },
                    body: JSON.stringify(mesages),
                  }).then((response) => response.json())
                  .then((responseJson) => {
                  // console.log(responseJson);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
                }
              }
              //Cập nhập số dư ví
              updateMoneyWallet(Wallet, money, groupType);
              setMoney(0);
              setMoneyFormat("");
              setNote("");
              setGroupType("chi");
              setShow(false);
              setWallet("")
              setWalletName("Chọn ví")
              setGroup("")
              setGroupName("Chọn danh mục")
              navigation.navigate('ExchangeScreen');
            }
          });
        } else{
            // Xử lý logic chuyển tiền từ Ví này sang ví kia
            // Tạo 2 giao dịch 1 giao dịch trừ tiền, 1 giao dịch cộng tiền
            // Add field isNotShowReport = true để không hiển thị báo cáo
            let timeUpdate = date.getTime()
            let dataUpdate1 = {
              money: money,
              groupType: 'chi',
              dateTrading: timeUpdate,
              wallet: Wallet,
              content: `Chuyển tiền ${WalletName} sang ${WalletReceiName}`,
              note: note,
              createAt: firebase.database.ServerValue.TIMESTAMP,
              updateAt: firebase.database.ServerValue.TIMESTAMP,
              images: images,
              uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
              isNotShowReport: true,
              relatedWallet: WalletRecei
            }

            const newExchange = await ExchangeRef.push(dataUpdate1, (error:any) => {
              if (error) {
                Alert.alert('Lỗi không mong muốn!')
              } else {
                //Cập nhập số dư ví
                updateMoneyWallet(Wallet, money, 'chi');
              }
            });

            let idExchange = newExchange.key 
            let dataUpdate2 = {
              money: money,
              groupType: 'thu',
              dateTrading: date.getTime(),
              wallet: WalletRecei,
              content: `Chuyển tiền ${WalletName} sang ${WalletReceiName}`,
              note: note,
              createAt: firebase.database.ServerValue.TIMESTAMP,
              updateAt: firebase.database.ServerValue.TIMESTAMP,
              images: images,
              uid: userRedux.userInfo.id ?  userRedux.userInfo.id : 0,
              isNotShowReport: true,
              relatedId: idExchange ? idExchange : null,
              relatedWallet: Wallet
            }

            const newExchange2 = await ExchangeRef.push(dataUpdate2, (error:any) => {
              if (error) {
                Alert.alert('Lỗi không mong muốn!')
              } else {
                //Cập nhập số dư ví
                updateMoneyWallet(WalletRecei, money, 'thu');
                setMoney(0);
                setMoneyFormat("");
                setNote("");
                setGroupType("chi");
                setShow(false);
                setWallet("")
                setWalletName("Chọn ví")
                setWalletRecei("")
                setWalletReceiName("Chọn ví nhận")
                setGroup("")
                setGroupName("Chọn danh mục")
                navigation.navigate('ExchangeScreen');
              }
            });
            let newId = newExchange2.key
            if(newId){
              ExchangeRefKey(idExchange).update({relatedId:newId},(error:any)=>{
                navigation.navigate('ExchangeScreen')
              })
            }
        }
      }
    }
    function getIconUrl(findkey:string) {
        for (const [key, value] of Object.entries(imageList.icons)) {
          if(findkey==key){
            return value
          }
        }
    }

    function convertImageUri(uri:string){  
        let newUri = uri.substr(uri.lastIndexOf('/') + 1)
        let newUri2 = newUri.split('?')[0]
        return 'https://ik.imagekit.io/huudepzai/'+decodeURIComponent(newUri2)
    }
    
    function updateMoneyWallet(id:any, money:number, type:string){
      walletRefKey(id)
      .once('value', (snapshot:any) => {
        let data = snapshot.val();
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


    const onSwipePerformed = (action:string) => {
      switch(action){
        case 'right':{
          if(selectedImage - 1 <= 0){
            setSelectedImage(selectedImage-1)
          } else{
            setSelectedImage(images.length-1)
          }
          break;
        }
        case 'left':{
          if( selectedImage + 1 <= images.length - 1){
            setSelectedImage(selectedImage+1)
          } else{
            setSelectedImage(0)
          }
          break;
        }
      }
    }


    return (
      <View style={{ backgroundColor: themeUse.[themeSelected].backgroundColorHide,paddingTop: 20, paddingLeft: 15, paddingRight: 15, height: "100%", width: "100%"}}>
          <View style={GroupStyle.item}>
            <Image style={[BaseStyle.iconimg]} source={imageList.icons.icon_75} />
            <TextInput
              placeholder="Số tiền giao dịch"
              value={moneyFormat}
              style={[GroupStyle.input,{backgroundColor:themeUse.[themeSelected].backgroundColor,color:themeUse.[themeSelected].textColor}]}
              keyboardType = 'numeric'
              onChangeText={(value)=>{
                setMoney(parseInt(value.replace(/\./g, "")));
                setMoneyFormat(value.replace(/\./g, "").replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.'));
              }}
              placeholderTextColor={themeUse.[themeSelected].textColor}
            />
          </View>

          <View style={{padding: 1, flexDirection: 'row'}}>
						<Pressable onPress={() => {setGroupType('chi'); setGroup(""); setGroupName("Chọn danh mục"); }} >
            	<Text style={[groupType == 'chi' ? BaseStyle.active : {color: themeUse.[themeSelected].textColor}, { padding: 5}]}>Khoản chi</Text>
            </Pressable>
						<Pressable onPress={() => {setGroupType('thu'); setGroup(""); setGroupName("Chọn danh mục"); }}>
            	<Text style={[groupType == 'thu' ? BaseStyle.active : {color: themeUse.[themeSelected].textColor}, { padding: 5 }]}>Khoản thu</Text>
            </Pressable>
						<Pressable onPress={() => {setGroupType('chuyentien'); setGroup(""); setGroupName("Chọn danh mục"); }}>
            	<Text style={[groupType == 'chuyentien' ? BaseStyle.active : {color: themeUse.[themeSelected].textColor}, { padding: 5 }]}>Chuyển tiền</Text>
            </Pressable>
					</View>
          
          {groupType !== 'chuyentien' &&
          <TouchableOpacity onPress={()=> {setModaGroupVisible(true) }}>
              <View style={[BaseStyle.detail]}>
                  <Image style={BaseStyle.iconimg} source={getIconUrl(iconGroup)} />
                  <Text style={{fontSize: 15, marginLeft: 10,color: themeUse.[themeSelected].textColor}}>{groupName}</Text>
              </View>
          </TouchableOpacity>
          }
          <View style={[BaseStyle.detail]}>
            <AntDesign style={BaseStyle.iconimg} name="book" size={40} color={themeUse.[themeSelected].textColor} />
            <TextInput
              placeholder="Ghi chú"
              value={note}
              style={[GroupStyle.input,{backgroundColor:themeUse.[themeSelected].backgroundColor,color:themeUse.[themeSelected].textColor}]}
              onChangeText={setNote}
              placeholderTextColor={themeUse.[themeSelected].textColor}
            />
          </View>

          <View style={[BaseStyle.detail]}>
            <Image style={BaseStyle.iconimg} source={imageList.icons.icon_77} />
            <TouchableOpacity onPress={()=>setModaWalletVisible(true)}>
            <Text style={{marginLeft: 10,color: themeUse.[themeSelected].textColor}}>{WalletName}</Text>
            </TouchableOpacity> 
            {groupType == 'chuyentien' &&
              <View style={BaseStyle.detail}>
                <AntDesign name="arrowright" style={{ paddingLeft: 10}}/>
                <TouchableOpacity onPress={()=>setModaWalletVisibleRecei(true)}>
                  <Text style={{marginLeft: 10,color: themeUse.[themeSelected].textColor}}>{WalletReceiName}</Text>
                </TouchableOpacity> 
              </View>
            }
          </View>

          
          <View style={[BaseStyle.detail]}>
            <AntDesign style={BaseStyle.iconimg} name="calendar" size={40} color={themeUse.[themeSelected].textColor} />
            {!show &&<TouchableOpacity onPress={() => setShow(true)}  >
              {/* <Text>Hôm nay</Text> */}
              <Moment date={date} 
              style={{marginLeft: 10,color:themeUse.[themeSelected].textColor}}  
              element={Text} format="DD/MM/YYYY" />
              </TouchableOpacity> 
            }
            {show && (<DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              style={{width: 320, backgroundColor: themeUse.[themeSelected].backgroundColor}} 
              locale="vi"
              textColor={themeUse.[themeSelected].textColor}
            />)}
          </View>
          <View style={[BaseStyle.detail]}>
            {!isUploading &&
            <TouchableOpacity onPress={openImagePickerAsync}  >
              <AntDesign style={BaseStyle.iconimg} name="camerao" size={40} color={themeUse.[themeSelected].textColor} />
            </TouchableOpacity>
            }
            {isUploading && 
            <Progress.Bar progress={procgressPercent} width={200} />
            }
          </View>
          <View style={{flexDirection:'row'}} >
          {images && images.length > 0 && images.map((item:any,index:any) => {
            return <TouchableOpacity onPress={()=> {setModalImage(true); setSelectedImage(index)}} style={{backgroundColor:'#fff',borderTopColor:"#ccc",borderTopWidth:1,
            borderBottomColor:"#ccc",borderBottomWidth:1,
            borderLeftColor:"#ccc",borderLeftWidth:1,
            borderRightColor:"#ccc",borderRightWidth:1,
            margin:2}}
            key={index}
            >
              <Image source={{uri: convertImageUri(item)+'?tr=w-100,h-100'}} style={{width:50,height:50}} />
              </TouchableOpacity>
          })
          }
          </View>

          <View style={{flexDirection: "row", marginTop: 15, justifyContent: "center"}}>
          <TouchableOpacity onPress={() => {navigation.navigate('MainExchangeScreen')}} style={{ marginRight: 5}} >
            <Text  style={[{width: 150, paddingTop: 10, paddingBottom: 10, backgroundColor:"#ff0000",color: "#fff",fontSize: 20, textAlign:"center"}]}>Đóng</Text>
          </TouchableOpacity>
          {relatedId===null &&
          <TouchableOpacity onPress={saveExchange}  >
            <Text  style={[{width: 150, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
          </TouchableOpacity>
          }
          </View>
          <Modal
              animationType="fade"
              transparent={true}
              visible={modaGroupVisible}
              onRequestClose={() => {
                setModaGroupVisible(!modaGroupVisible);
              }}
          >
            <View style={BaseStyle.centeredView}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor:themeUse.[themeSelected].backgroundColor}]}>
              {
                Object.keys(groupList).length > 0 &&
                Object.keys(groupList).map( (key,index) => (
                    groupList[key].info.groupType == groupType &&
                    <DetailGroup key={key} groupInfo={groupList[key]} groupList={groupList} createAt={groupList[key].createAt} id={key} navigation={navigation} />
                ))
              }
              </ScrollView>
            </View>
          </Modal>
          <Modal
              animationType="fade"
              transparent={true}
              visible={modaWalletVisible}
              onRequestClose={() => {
                setModaWalletVisible(!modaWalletVisible);
              }}
              style={{backgroundColor: themeUse.[themeSelected].backgroundColor, paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
          >
            <View style={BaseStyle.centeredView}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor:themeUse.[themeSelected].backgroundColor}]}>
              {
                Object.keys(walletList).length > 0 &&
                Object.keys(walletList).map( (key,index) => (
                  <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {setWallet(key); setWalletName(walletList[key].walletName); setModaWalletVisible(false)}} key={key} >
                    <Text style={{fontWeight: "bold",color:themeUse.[themeSelected].textColor}}>{walletList[key].walletName}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
            </View>
          </Modal>
          
          <Modal
              animationType="fade"
              transparent={true}
              visible={modaWalletVisibleRecei}
              onRequestClose={() => {
                setModaWalletVisibleRecei(!modaWalletVisibleRecei);
              }}
              style={{backgroundColor: themeUse.[themeSelected].backgroundColor, paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
          >
            <View style={BaseStyle.centeredView}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor:themeUse.[themeSelected].backgroundColor}]}>
              {
                Object.keys(walletList).length > 0 &&
                Object.keys(walletList).map( (key,index) => (
                  <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {setWalletRecei(key); setWalletReceiName(walletList[key].walletName); setModaWalletVisibleRecei(false)}} key={key} >
                    <Text style={{fontWeight: "bold",color:themeUse.[themeSelected].textColor}}>{walletList[key].walletName}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
            </View>
          </Modal>

          <Modal
              animationType="fade"
              transparent={true}
              visible={modalImage}
              onRequestClose={() => {
                setModalImage(false);
              }}
              style={{backgroundColor: themeUse.[themeSelected].backgroundColor, paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
          >
            <View style={BaseStyle.centeredView}>
              <ScrollView style={[BaseStyle.modalView,{backgroundColor:themeUse.[themeSelected].backgroundColor}]}>
              <View style={{marginTop:10,flexDirection:"row"}}>
              <TouchableOpacity onPress={()=>setModalImage(false)}><AntDesign style={BaseStyle.iconimg} name="close" size={40} color={themeUse.[themeSelected].textColor} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>removeImage()}><AntDesign style={BaseStyle.iconimg} name="delete" size={40} color={themeUse.[themeSelected].textColor} /></TouchableOpacity>
              </View>
              <SwipeGesture  onSwipePerformed={onSwipePerformed}>
              <View style={{minHeight: Dimensions.get('window').height - 150}}>
              {images && images.length > 0 && 
                <ImageScale source={{uri: convertImageUri(images[selectedImage])}} width={deviceWidth} /> 
              }
              </View>
              </SwipeGesture>
            </ScrollView>
            </View>
          </Modal>
      </View>
    );

    function DetailGroup(props:any){
      let groupChilds = props.groupInfo.childs ? props.groupInfo.childs : [];
      return (
        <View style={{marginBottom: 5, marginTop: 5}}>
        <View style={[BaseStyle.detail]}>
            <Image style={{width: 50, height: 50}} source={getIconUrl(props.groupInfo.info.icon)} />
            <TouchableOpacity style={BaseStyle.detailText} onPress={()=>{setGroup(props.id); setGroupName(props.groupInfo.info.groupName); 
                    setIconGroup(props.groupInfo.info.icon); setModaGroupVisible(false)}} 
            >
                <Text style={{color:themeUse.[themeSelected].textColor}}>{props.groupInfo.info.groupName}</Text>
            </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5}}>
            {Object.keys(groupChilds).length > 0 &&
                Object.keys(groupChilds).map( (key,index) => (
                <View style={{flexDirection: "row"}} key={key}>
                    <TextInput style={{width:10, height: 20, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: "#ccc"}} value="" editable={false} />
                    <Image style={BaseStyle.iconimg} source={getIconUrl(groupChilds[key].info.icon)} />
                    <Pressable style={[BaseStyle.detailText, {paddingTop: 10}]} onPress={()=>{setGroup(key); 
                      setGroupName(groupChilds[key].info.groupName);
                      setIconGroup(groupChilds[key].info.icon); setModaGroupVisible(false)}} 
                    >
                        <Text style={{color:themeUse.[themeSelected].textColor}}>{groupChilds[key].info.groupName}</Text>
                    </Pressable>
                </View>
                ))
            }
        </View>
        </View>
      )
    }
}

// async function sendPushNotification(messages:any) {
//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(messages),
//   });
// }