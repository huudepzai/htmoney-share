import { StyleSheet } from 'react-native';
export default StyleSheet.create({
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
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "100%"
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    input: {
      height: 40,
      marginLeft: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: "#ccc",
      flexGrow:2,
      paddingLeft: 10
    },
    item: {
      padding: 1,
      flexDirection: 'row',
      marginBottom: 10
  }
});
  