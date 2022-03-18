
import React from 'react';
import {  Text, TextInput, View, Alert, Pressable } from 'react-native';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux'
import {singInUser, loadingLogin} from '../redux/action/user'
import {firebaseApp} from '../config/FirebaseConfig'
import * as themeUse from '../styles/BaseStyle';

const BaseStyle = themeUse.default
export default function SignInScreen() {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
    const userRedux = useSelector((state:any) => state.useReducer)
    const dispatch = useDispatch()
    const themeSelected = useSelector<any>((state:any) => state.theme.selectedTheme);
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const backgroundColorHide = themeUse.[themeSelected].backgroundColorHide
    const textColor = themeUse.[themeSelected].textColor
    
    function singIn(){
        if(email.trim() != "" && password.trim() != "") {
            dispatch(loadingLogin(true))
            firebaseApp
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential:any) => {
                    dispatch(loadingLogin(false))
                    dispatch( singInUser({email: userCredential.user.email,
                            id: userCredential.user.uid,
                            displayName: userCredential.user.displayName 
                        }))
                    }
                )
                .catch(error => {
                    dispatch(loadingLogin(false))
                    Alert.alert(
                        'Lỗi',
                        'Thông tin đăng nhập không chính xác!',
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: true }
                    )
                })
        } else {
            Alert.alert(
            'Warning',
            'Enter email and password',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
            )
        }
    }
	return (
		<View style={[BaseStyle.splashContainer,{backgroundColor:backgroundColorHide}]}>
		<TextInput
			placeholder="Email"
			value={email}
      style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
			onChangeText={setEmail}
      placeholderTextColor={textColor}
		/>
		<TextInput
			placeholder="Password"
			value={password}
			onChangeText={setPassword}
			secureTextEntry
      style={[BaseStyle.input,{backgroundColor:backgroundColor,color:textColor}]}
      placeholderTextColor={textColor}
		/>
        <Pressable onPress={singIn} style={{flex: 1, alignItems: "center"}} >
          <Text  style={[{width: 200, paddingTop: 10, paddingBottom: 10, backgroundColor:"green",color: "#fff",fontSize: 20, textAlign:"center"}]}>Đăng nhập</Text>
        </Pressable>
		</View>
	);
}