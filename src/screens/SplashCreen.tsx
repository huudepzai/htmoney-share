import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {  Text, TouchableOpacity, View, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import * as themeUse from '../styles/BaseStyle'
const BaseStyle = themeUse.default

export default function SplashScreen() {
  const useReducer = useSelector(state => state)
    const listsText = [
        'Nguyên tắc 1: Đừng để tiền rơi.\nNguyên tắc 2: Xem lại nguyên tắc 1',
        'Nếu không tìm cách kiếm được tiền ngay cả lúc đang ngủ, bạn sẽ phải làm việc cho tới khi chết',
        'Sống ở đời, phàm mọi thứ trên trời rơi xuống chỉ có nước mưa và cứt chim thôi!',
        'Khi quyết định mua một thứ gì đó hãy suy nghĩ 5 ngày trước khi xuống tiền.',
        'Đừng bỏ hết trứng vào 1 giỏ'
    ]
    const random = Math.floor(Math.random() * listsText.length);
    const themeSelected = useSelector<any>((state:any) => state.theme.selectedTheme);
    const backgroundColor = themeUse.[themeSelected].backgroundColor
    const textColor = themeUse.[themeSelected].textColor
	return (
        <View style={[BaseStyle.splashContainer,{backgroundColor:backgroundColor}]}>
          <Text style={[BaseStyle.splashText,{color:textColor}]}>HTMONEY - Quản lý chi tiêu</Text>
          <Image
            style={BaseStyle.logo}
            source={require('../assets/images/icon.png')}
        />
        <Text style={{color:textColor}}>
            {listsText[random]}
        </Text>
	  </View>
	);
  }