import * as React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity,Dimensions, Modal, Platform, FlatList, Alert,Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment';
import 'moment/locale/vi';
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker';

import { Text, View } from 'react-native';
import {firebaseApp} from '../config/FirebaseConfig'
import  * as themeUse from '../styles/BaseStyle';
import {addGroup, addFilter} from '../redux/action/exChange'
import {Picker} from '@react-native-picker/picker';
import {LineChart, BarChart, PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit";
import { useFocusEffect } from '@react-navigation/native';
import imageList from "../imageList"
const BaseStyle = themeUse.default
const colorList = [
  "#66B266",
  "#F47E7E",
  "#B1C7C0",
  "#96DFCE",
  "#82b9ec",
  "#b57e6c",
  "#cb764b",
  "#122464",
  "#a3a8a0",
  "#ba231f",
  "#b4df99"
];
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  barPercentage: 0.5,
};
const GroupRef = firebaseApp.database().ref('/group');
const walletRef = firebaseApp.database().ref('/wallet');
const ExchangeRef = firebaseApp.database().ref('/exchange');
const ExchangeRefKey = (key:any) => firebaseApp.database().ref('/exchange/'+key);
const walletRefKey = (key:any) => firebaseApp.database().ref('/wallet/'+key);

export default function TabReportScreen({navigation}:any) {
  const [modaWalletVisible, setModaWalletVisible] = React.useState(false);
  const [modaGroupTypeVisible, setModaGroupTypeVisible] = React.useState(false);
  const [walletList, setWalletList] = React.useState<any>([]);
  const [walletName, setWalletName] = React.useState('Tất cả ví');
  const [selectedFill, setSelectedFill] = React.useState('thisMonth');
  const dispatch = useDispatch()
  const [showStart, setShowStart] = React.useState(Platform.OS === 'ios');
  const [showEnd, setShowEnd] = React.useState(Platform.OS === 'ios');
  const [total, setTotal] = React.useState(0);
  const [group, setGroup] = React.useState("");
  const fillters = useSelector((state:any) => state.exChangeReducer.fillters);
  const [groupReportData, setGroupReportData] = React.useState<any[]>([]);
  const [groupExchange, setGroupExchange] = React.useState<any[]>([]);
  const [walletReportData, setWalletReportData] = React.useState<any[]>([]);
  const [isParentGroup, setIsParentGroup] = React.useState(true);
  const [parentId, setParentId] = React.useState("");
  const [dataGroupState, setDataGroupState] =  React.useState<any[]>([]);
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const textColor = themeUse.[themeSelected].textColor

  React.useEffect(() => {
    const onValueChange = walletRef
      .on('value', (snapshot:any) => {
        let dataWallet = snapshot.val()
        setWalletList(dataWallet)
        if(typeof fillters.walletId != 'undefined' && fillters.walletId != ""){
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
            <Text style={{fontWeight: "bold", color: textColor}}>{walletName}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => setModaGroupTypeVisible(true)} style={{paddingRight: 15}} >
          <Text style={{fontWeight: "bold", textTransform: "capitalize", color: textColor}} >{typeof fillters.groupType != "undefined" && fillters.groupType}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, walletName, fillters.groupType,themeSelected]);
  
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
  }, [fillters.selectedFill, selectedFill]);
  useFocusEffect(
    React.useCallback(() => {
    fillters.startDateFill.setHours(0);
    fillters.startDateFill.setMinutes(0);
    fillters.startDateFill.setSeconds(0);
    fillters.endDateFill.setHours(23);
    fillters.endDateFill.setMinutes(59);
    fillters.endDateFill.setSeconds(59);
    const onValueChangeGroup = GroupRef
      .on('value', (snapshot:any) => {
        if(snapshot.val() != null){
          let dataGroup = snapshot.val();
          let GroupReportRs:any = []; 

          if(group != ""){
            Object.keys(dataGroup).forEach( function(key){
              if(key != group && dataGroup[key].parent != group){
                delete dataGroup[key]
              }
            })
          }

          ExchangeRef
          .orderByChild('dateTrading')
          .startAt(fillters.startDateFill.getTime())
          .endAt(fillters.endDateFill.getTime())
          .on('value', (snapshot:any) => {
            let dataExchange:any = snapshot.val();
            let dataGroupExchange:any = [];
            if(dataExchange != null){
              Object.keys(dataExchange).forEach( function(key){
                if(dataExchange[key].groupType == fillters.groupType && typeof dataGroup[dataExchange[key].group] != "undefined"){
                  if(fillters.walletId == "" || (dataExchange[key].wallet == fillters.walletId)){
                    dataGroupExchange.push(dataExchange[key])
                    let keyGroup = dataGroup[dataExchange[key].group].parent != "" ? dataGroup[dataExchange[key].group].parent : dataExchange[key].group;
                    let parentIdGroup = dataGroup[dataExchange[key].group].parent != "" ? dataGroup[dataExchange[key].group].parent : "";
                    if(group != ""){
                      keyGroup = dataExchange[key].group;
                    }
                    if(typeof GroupReportRs[keyGroup] == 'undefined'){
                      GroupReportRs[keyGroup] = {
                        name: dataGroup[keyGroup].groupName,
                        money: dataExchange[key].money,
                        parentIdGroup: keyGroup != parentIdGroup ? parentIdGroup : ""
                      }
                    }else{
                      GroupReportRs[keyGroup].money = GroupReportRs[keyGroup].money + dataExchange[key].money
                    }
                  }
                }
              })
              //format lịch sử giao dịch 
              let dataFormat:any = [];
              if(dataGroupExchange != null){
                let result =  Object.keys(dataGroupExchange).sort((a:any, b:any) => (dataGroupExchange[a].dateTrading > dataGroupExchange[b].dateTrading) ? -1 : 1);
                result.forEach( function(key){
                        let dateString = moment(dataGroupExchange[key].dateTrading).format("YYYY-MM-DD");
                        dataGroupExchange[key].id = key;
                        if(typeof dataFormat[dateString] == "undefined"){
                          dataFormat[dateString] = {
                            history: [dataGroupExchange[key]],
                            totalMoney: dataGroupExchange[key].money
                          } 
                        } else{
                          dataFormat[dateString]['history'].push(dataGroupExchange[key]);
                          dataFormat[dateString]['totalMoney'] = dataFormat[dateString]['totalMoney'] + dataGroupExchange[key].money
                        }
                })
              }
              setGroupExchange(dataFormat);

              setGroupExchange(dataFormat)
              
              let dataReportGroup:any  = [];
              let dataReportWallet:any = [];
              let totalAll = 0;
              if(Object.keys(GroupReportRs).length > 0){
                Object.keys(GroupReportRs).forEach(function(key:any,index:any){
                  dataReportGroup.push({
                    name: GroupReportRs[key].name,
                    money: GroupReportRs[key].money,
                    color: colorList[index],
                    legendFontColor: colorList[index],
                    legendFontSize: 10,
                    legend: GroupReportRs[key].name,
                    id: key,
                    isParent: GroupReportRs[key].parentIdGroup == "" ? true : false ,
                    parentId: GroupReportRs[key].parentIdGroup
                  })
                  totalAll = totalAll + GroupReportRs[key].money;
                })
                setGroupReportData(dataReportGroup);
                setWalletReportData(dataReportWallet);
                setTotal(totalAll);
              } else{
                setGroupReportData([]);
                setWalletReportData([]);
                setTotal(0)
              }
            }else{
              setTotal(0);
              setGroupReportData([]);
              setWalletReportData([]);
            }
          });
        }
    });
    return () =>
    GroupRef
    .off('value', onValueChangeGroup);
    }, [fillters.startDateFill, fillters.endDateFill, fillters.groupType,fillters.walletId, group, selectedFill])
  )

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
  <View style={[BaseStyle.containerDetail,{backgroundColor:themeUse.[themeSelected].backgroundColorHide,paddingLeft:10,paddingRight:10}]}>
    <Picker
      mode="dropdown"
      style={[BaseStyle.onePicker,{backgroundColor:backgroundColor,color:textColor,borderColor:backgroundColorHide}]} itemStyle={BaseStyle.onePickerItem}
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


    {Object.keys(groupReportData).length > 0 ?
    <ScrollView >
      { group != "" && 
        <TouchableOpacity onPress={() =>{setIsParentGroup(true);setGroup(group==parentId ? "" : parentId)}} style={{ marginBottom: 15, marginTop: 15, alignItems: "center"}} >
          <Text style={[{width: 150, paddingTop: 10, paddingBottom: 10, backgroundColor:"#ff0000",color: "#fff",fontSize: 20, textAlign:"center"}]}>Đóng</Text>
        </TouchableOpacity>
      }
      {isParentGroup &&
        <View style={{alignItems: "center"}}>
          <PieChart
            data={groupReportData}
            height={200}
            width={screenWidth}
            chartConfig={chartConfig}
            accessor={"money"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            // center={[25, 10]}
            absolute={false}
            hasLegend={true}
            />
        </View>
        }
        {isParentGroup && Object.keys(groupReportData).map((key:any,index:any)=>(
          <TouchableOpacity onPress={() => {setGroup(groupReportData[key].id); setIsParentGroup(groupReportData[key].isParent); setParentId(groupReportData[key].parentId)  }} 
            style={{marginBottom: 10, borderBottomColor: "#ccc", borderBottomWidth: 1, flexDirection:"row"}}
            key={key}
          >
            <Text style={{color: groupReportData[key].color, fontSize: 15, fontWeight: "bold", flexGrow: 5}}>{groupReportData[key].name}</Text>
            <Text style={{color: groupReportData[key].color, fontSize: 15, fontWeight: "bold", width: 150, textAlign: "right"}}>
              {String(groupReportData[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
            </Text>
          </TouchableOpacity>
        ))}
        {isParentGroup &&
         <View style={{marginBottom: 40, borderBottomColor: "#ccc", borderBottomWidth: 1, flexDirection:"row"}} >
            <Text style={{fontSize: 15, fontWeight: "bold", flexGrow: 5,color: themeUse.[themeSelected].textColor}}>Tổng</Text>
            <Text style={{fontSize: 15, fontWeight: "bold", width: 150, textAlign: "right", color: themeUse.[themeSelected].textColor}}>
              {String(total).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫
            </Text>
          </View>
        }
          {group != '' && Object.keys(groupExchange).length > 0 &&
            <FlatList
              data={Object.keys(groupExchange)}
              renderItem={({ item }) => <DetailExchangeReport  key={item} date={item} history={groupExchange[item]}  walletList={walletList} />}
              keyExtractor={(item, index)  => item}
            />
        }
      </ScrollView>
    : <Text style={{color:textColor}}>Không có dữ liệu</Text>
    }
    <Modal animationType="fade"
          transparent={true}
          visible={modaWalletVisible}
          onRequestClose={() => {
            setModaWalletVisible(!modaWalletVisible);
          }}
          style={{backgroundColor: backgroundColorHide, paddingTop: 20,paddingLeft: 20, paddingRight: 20}}
      >
        <View style={[BaseStyle.centeredView]}>
          <ScrollView style={[BaseStyle.modalView,{backgroundColor:backgroundColorHide}]}>
          <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.walletId = ""; dispatch(addFilter(fillters));  setWalletName("Tất cả ví"); setModaWalletVisible(false)}}  >
            <Text style={{fontWeight: "bold",color:textColor}}>Tất cả ví</Text>
          </TouchableOpacity>
          {
            Object.keys(walletList).length > 0 &&
            Object.keys(walletList).map( (key,index) => (
              <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.walletId = key; dispatch(addFilter(fillters));  setWalletName(walletList[key].walletName); setModaWalletVisible(false)}} key={key} >
                <Text style={{fontWeight: "bold",color:textColor}}>{walletList[key].walletName}</Text>
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
            <ScrollView  style={[BaseStyle.modalView,{backgroundColor:backgroundColorHide}]}>
            <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.groupType = "chi"; dispatch(addFilter(fillters)); setModaGroupTypeVisible(false)}}  >
                <Text style={{fontWeight: "bold",color:textColor}}>chi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, marginBottom: 10}} onPress={()=> {fillters.groupType = "thu";dispatch(addFilter(fillters)); setModaGroupTypeVisible(false)}}  >
                <Text style={{fontWeight: "bold",color:textColor}}>thu</Text>
              </TouchableOpacity>
          </ScrollView>
          </View>
        </Modal>
  </View>
  )
}

function DetailExchangeReport(props: any){
  let history = props.history.history;
  let totalMoney = props.history.totalMoney;
  const exChangeState = useSelector((state:any) => state.exChangeReducer);
  const allUser = useSelector((state:any) => state.useReducer.allUser);
  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColorDown = themeUse.[themeSelected].downColor
  const textColor = themeUse.[themeSelected].textColor
  const textColorSub = themeUse.[themeSelected].textColorSub
  return(
    <View style={{backgroundColor: backgroundColor, width: "100%", marginBottom: 10, borderRadius: 5, shadowOffset: {width: 0,height: 2},padding:15}}>
      <View style={styles.header} >
        <View style={{flexDirection: "row"}}>
          <Moment  locale="vi" format="dddd DD/MM/YYYY" element={Text} style={[styles.date,{color:textColor}]} >{props.date}</Moment>
          <Text style={{color: textColorDown, fontWeight: "bold", textAlign: "right", flexGrow:5}}>{String(totalMoney).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
        </View>
        <Text style={{color:textColor}}>{Object.keys(history).length} giao dịch</Text>
      </View>
      {
        Object.keys(history).map((item:any, key:any)=>(
          <View key={key} style={{marginBottom: 10, marginTop: 15, flexDirection: "row"}}>
            {typeof exChangeState.groups[history[key].group] != "undefined"  ? 
              <Image style={BaseStyle.iconimg} source={imageList.icons.icon_1} /> : 
              <Image style={BaseStyle.iconimg} source={imageList.icons.icon_1} />
            }
            <View style={{flex: 5, paddingLeft: 5}}>
                {typeof exChangeState.groups[history[key].group] != "undefined"  ? 
                  <Text style={{fontSize: 16,color:textColor}}>{exChangeState.groups[history[key].group].groupName}</Text> :<Text></Text>
                }
                <Text style={{fontSize: 12, marginTop: 5, color: textColorSub}}>{history[key].note} {typeof allUser != 'undefined' && typeof allUser[history[key].uid] != 'undefined' ? "by: " + allUser[history[key].uid].displayName : ""}</Text>
            </View>
            <View style={{width: 100, alignItems: "flex-end"}}>
              <Text style={{color: history[key].groupType == "chi" ? "#ff0000" : "green", fontWeight: "bold"}}>{String(history[key].money).replace(/(\d)(?=(\d{3})+(?!\d)+(?!\d))/g, '$1.')}₫</Text>
            </View>
          </View>
        ))
      }
    </View>
    
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
  header:{
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  date: {
    fontSize: 22,
    textTransform: "capitalize",
    flexGrow: 5
  },
});


