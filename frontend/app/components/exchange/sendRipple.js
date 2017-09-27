// import liraries
import React, { Component } from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import HomeContainer from '../home/homeContainer';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import Tabs from 'react-native-tabs';
import Button from 'react-native-buttons';
import Icon from 'react-native-vector-icons/Octicons';

// create a component
//I DID NOT MAKE SURE THAT THE INPUT FIELDS ARE NUMBERS AND NOT LETTERS BECAUSE THIS WILL BE SOLVED WITH A NUMBERPAD LATER
class SendRipple extends Component {
  constructor(props){
    super(props);
    this.sendPayment = this.sendPayment.bind(this);
    this.state = {
      toAddress: "",
      toDesTag: undefined,
      amount: "",
      disabled: false,
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event){
    if ( event.id === "bottomTabSelected" )
    {
      this.props.navigator.resetTo({
        screen: 'Exchange',
        navigatorStyle: {navBarHidden: true}
      })
    }
  }
  //MAKE SURE TO LEAVE THIS HERE AND THEN ADD YOUR TABS
  //WE HAVE TO REQUEST TRANSACTIONS EVERY TIME WE GO TO THE WALLET OR THE HOME.
  //Make sure to request Transactions BEFORE you request address and dest tag before you go to the wallet.

  sendPayment(){
    if ( !this.props.fromAddress || !this.props.sourceTag)
    {
      this.props.addAlert("Please get a wallet first")
    }
    //This is the REGEX to validate a Ripple Address
    else if(!this.state.toAddress.match(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/))
    {
      this.props.addAlert("Invalid Ripple Address");
    }
    else{
      let array = Object.keys(this.state);
      for (let i = 0; i < array.length; i++)
      //there does not need to be a destination tag
      {
        if ( this.state[array[i]] === "" && array[i] !== "toDesTag")
        {
          this.props.addAlert("Please Try Again");
          return;
        }
      }
      let {toDesTag, toAddress, amount} = this.state;
      if ( !parseFloat(amount) )
      {
        this.props.addAlert("Can't send 0 XRP");
        return;
      }
      this.setState({disabled: true});
      this.props.signAndSend(parseFloat(amount), this.props.fromAddress, toAddress, parseInt(this.props.sourceTag), parseInt(toDesTag), this.props.user.user_id).then(()=> this.setState({disabled: false}));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Send Your Ripple
          </Text>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Destination Address"
            onChangeText={
              (toAddr) => {
                this.setState({toAddress: toAddr});
              }
            }
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Destination Tag - optional"
            onChangeText={
              (des) => {
                this.setState({toDesTag: des});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.field}>
          <TextInput
            placeholder="Amount"
            onChangeText={
              (amt) => {
                this.setState({amount: amt});
              }
            }
            autoCorrect={false}
            autoCapitalize={'none'}
            style={styles.textInput}/>
          <View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity disabled={this.state.disabled} onPress={this.sendPayment}>
            <Text style={this.state.disabled ? styles.redbutton : styles.greenbutton}>
              Send Payment
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.redtoptext}>
          Transaction Fee: 0.02 XRP
        </Text>
        <Text style={styles.redtext}>
          Warning: You will be charged a fee if you send to other party and they require a destination tag or if you send less than 20 ripple to a new wallet
        </Text>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  mainContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#111F61',
   },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    backgroundColor: '#111F61',
  },

  titleContainer: {
    padding: 0,
    alignItems: 'center',
  },

  title: {
    color: '#F2CFB1',
    fontSize: 35,
    // marginTop: 20,
    // marginBottom: 20,
    // padding: 20,
    // flex: 1,
    top: 20,
    fontFamily: 'Kohinoor Bangla'
  },

  field: {
    borderRadius: 5,
    padding: 5,
    paddingLeft: 8,
    margin: 45,
    marginTop: 0,
    top: 40,
    backgroundColor: '#fff'
  },

  textInput: {
    height: 26,
    fontFamily: 'Kohinoor Bangla'
  },

  buttonContainer: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 30
  },
  redtext: {
    color: 'red',
    fontSize: 15,
    marginTop: 20,
    textAlign: 'center',
    paddingRight: 10,
    paddingLeft: 10
  },
  redtoptext: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 50
  },
  greenbutton: {
    fontSize: 30,
    color: 'green',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'green',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  redbutton: {
    fontSize: 30,
    color: 'red',
    fontFamily: 'Kohinoor Bangla',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'red',
    borderBottomWidth: 0,
    shadowOpacity: 0.3,
    padding: 7
  },
  formError: {
    color: 'red'
  }
});

//make this component available to the app
export default SendRipple;
