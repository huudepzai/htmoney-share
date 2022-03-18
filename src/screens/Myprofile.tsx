import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {  Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import {Picker} from '@react-native-picker/picker';

import  * as themeUse  from '../styles/BaseStyle';
import {firebaseApp} from '../config/FirebaseConfig'
const userRef = (key:any) => firebaseApp.database().ref('/users/'+key);
const walletRef = firebaseApp.database().ref('/wallet')
const BaseStyle = themeUse.default

export default function Myprofile() {
	const userRedux = useSelector((state:any) => state.useReducer);
	const [displayName, setDisplayName] = React.useState("");
	const [defaultWallet, setDefaultWallet] = React.useState("");
	const [walletList, setWalletList] = React.useState<any>([]);

  const themeSelected = useSelector((state:any) => state.theme.selectedTheme);
  const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
  const backgroundColor = themeUse.[themeSelected].backgroundColor
  const textColor = themeUse.[themeSelected].textColor

	React.useEffect(() => {
      userRef(userRedux.userInfo.id)
        .once('value', (snapshot:any) => {
					let useInfo = snapshot.val()
					if(useInfo != null){
						setDisplayName(useInfo.displayName);
						setDefaultWallet(useInfo.defaultWallet);
					}else{
						setDisplayName("");
						setDefaultWallet("");
					}
			})
			walletRef.once('value', (snapshot:any) => {
        let dataWallet = snapshot.val()
        setWalletList(dataWallet)
      });
	},[])
	function saveProfile(){
		let dataUpdate = {
			displayName: displayName,
			defaultWallet: defaultWallet
		}
		userRef(userRedux.userInfo.id).update(dataUpdate);
		Alert.alert('Cập nhập thông tin thành công!')
	}
	return (
      <View style={[BaseStyle.containerDetail,{backgroundColor:backgroundColorHide}]}>
			{typeof userRedux.userInfo == "undefined" ?
			<Text style={BaseStyle.splashText}>Không tìm thấy user</Text>
			:<>
				<View>
					<Text style={{fontWeight: "bold",color:textColor}}>Tên hiển thị</Text>
					<TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={[BaseStyle.input,
                {marginLeft: 0, marginRight: 0, width: "100%",backgroundColor:backgroundColor,color:textColor}
              ]}
              placeholderTextColor={textColor}
            />
					<Text style={{fontWeight: "bold",color:textColor}}>Ví Mặc định</Text>
					<Picker
              mode="dropdown"
              style={[BaseStyle.onePicker,{backgroundColor:backgroundColor,color:textColor}]} itemStyle={BaseStyle.onePickerItem}
              selectedValue={defaultWallet}
              onValueChange={(itemValue:any, itemIndex:any) => setDefaultWallet(itemValue)}
            >
            <Picker.Item label="Không thiết lập" value="" />
						{
							Object.keys(walletList).length > 0 &&
							Object.keys(walletList).map( (key) => (
								<Picker.Item label={walletList[key].walletName} value={key} key={key} />
							))
            }
          </Picker>
					<TouchableOpacity onPress={saveProfile} style={{alignItems: "center"}} >
            <Text  style={[{ marginTop: 10, zIndex: 10, width: 200, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Lưu</Text>
          </TouchableOpacity>
				</View>
			</>
			}
	  </View>
	);
}