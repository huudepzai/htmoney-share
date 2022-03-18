
enum Colors {
  white = '#FFFFFF',
  black = '#000000',
  greem = '#39cba7',
  grey = '#f3f6ff',
  dark = '#212244',
  darkGrey = '#363762',
  c7f7f7f = '#7f7f7f',
  c9197B1 = '#9197B1',
  c656565 = '#656565',
  cced4da = '#ced4da',
  f8faff = '#f8faff',
  up = '#1DBA75',
  down = '#FF5858',
  ref = '#f7941d',
  ceil = '#ff25ff',
  transparent = 'transparent',
  yellow = '#fff9c4',
}


import { StyleSheet } from 'react-native';

export const light = {
  backgroundColor: Colors.white,
  backgroundColorHide: 'rgb(250, 250, 250)',
  textColor: Colors.black,
  textColorSub: Colors.black,
  downColor: Colors.down,
  upColor: Colors.up
}
export const dark = {
  backgroundColor: Colors.dark,
  backgroundColorHide: Colors.darkGrey,
  textColor: Colors.white,
  downColor: Colors.down,
  upColor: Colors.up,
  textColorSub: '#888'
}

const base =  StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10
    },
    splashText: {
        fontSize: 18,
        fontWeight:'bold'
    },
    title: {

    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
        width: '90%',
        borderWidth: 1,
        borderColor: "#ccc"
    },
    button: {
        backgroundColor: 'green',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: 200
    },
    logo: {
        width: 100,
        height: 100
    },
    containerDetail: {
        backgroundColor: "#fff",
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15
    },
    detail:{
        flexDirection: "row",
        alignItems: "center"
    },
    detailText:{
        fontWeight: "bold",
        flex: 5,
        fontSize: 20,
        flexGrow: 5
    },
    detailAction:{
        backgroundColor: "#f0f0f0",
        margin: 5,
        fontSize: 10,
        color: "#fff",
        flex: 1
    },
    buttonDetail:{
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: 200,
    },
    iconimg: {
        width: 40,
        height: 40
    },
    iconimgList: {
        flexDirection: "row",
        flexWrap: 'wrap',
        width: "100%",
        height: "80%",
        backgroundColor: "#fff",
       alignItems: "center",
    },
    active: {
       backgroundColor: "green",
       color: "#fff",
       paddingBottom: 5,
       paddingTop: 5,
       paddingRight: 5,
       paddingLeft: 5,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      shadowColor: "#000",
      width: "100%",
      height: "100%",
      shadowOffset: {
        width: 0,
        height: 2
      }
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
    
})
export default base;