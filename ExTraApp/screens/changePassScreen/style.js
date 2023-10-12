
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: 'white',
    flex: 1,
  },

  button: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    margin: 10,
    marginLeft: '30%',
    marginHorizontal: '30%',
  },

  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  
  logoContainer: {
    flexDirection: 'row',
    display: 'flex',
    height: '10%',
    margin: 5,


  },

  bottomContainer: {
    height: '4.5%',
    width: '100%',
    marginTop: '4%',
    backgroundColor: '#433FF4',
    marginBottom: '10%',
  },

  container: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#AEB4E8', // Background color
    height: '100%',
  },
  contentContainer: {
    paddingBottom: 20,
    borderRadius: 20,
    backgroundColor: '#AEB4E8', // Background color
  },
  

  textStyle: {
    marginLeft: '5%',
    color: 'black',
    marginBottom: '2%',
  },

  textTitle: {
    textAlign: 'center',
    marginBottom: '2%',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  logo: {
    width: '70%',
    aspectRatio: 4,
    resizeMode: 'contain',

  },


});
