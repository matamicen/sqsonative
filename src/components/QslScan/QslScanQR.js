import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import QsoHeader from './QsoHeader';
import { getQslScan } from '../../actions';
import MediaImages from './MediaImages';
import Likes from './Likes';
import Comments from './Comments';
import QRCodeScanner from 'react-native-qrcode-scanner';

class QslScanQR extends Component {
  // static navigationOptions = {
  //     tabBarLabel: 'Qsl ScanQR'

     



  // }

  constructor(props) {
    super(props);
    
    this.state = {
      conta: 0,
      actindicatorfecthQslCard: false,
      scanQR: false
      
    };
  }

  gotoQslScanScreen = async () => {


           this.props.navigation.navigate("QslScanScreen");
        
     }

  onSuccess = async function(e) {
    // onSuccess(e) {
    // 
       // Linking
       //   .openURL(e.data)
       //   .catch(err => console.error('An error occured', err));
       //this.ScanQSL2(e);
        this.setState({actindicatorfecthQslCard: true})
       console.log('el codigo Scaneado es: ' +e.data);
       await this.props.getQslScan(e.data);
       this.setState({actindicatorfecthQslCard: false})
       this.gotoQslScanScreen();
     //   this.setState({scanQR: !this.state.scanQR})

        
   
       //   this.setState({scanQR: !this.state.scanQR})
     }

     onSuccess_test = async function() {
      // onSuccess(e) {
      // 
         // Linking
         //   .openURL(e.data)
         //   .catch(err => console.error('An error occured', err));
         //this.ScanQSL2(e);
          this.setState({actindicatorfecthQslCard: true})
        //  console.log('el codigo Scaneado es: ' +e.data);
         await this.props.getQslScan('cef4b543-bdad-11e8-ae0b-061cacc9b2a2');
         this.setState({actindicatorfecthQslCard: false})
         this.gotoQslScanScreen();
       //   this.setState({scanQR: !this.state.scanQR})
  
          
     
         //   this.setState({scanQR: !this.state.scanQR})
       }

     render() { console.log("RENDER QSL SCAN SCREEN!" );

return   <View style={{flex: 1}}>
    
      <QRCodeScanner
               onRead={this.onSuccess.bind(this)}
             // onRead={() => this.ScanQSL2(this)}
           
  
            >
                   

            </QRCodeScanner>

             <Modal visible={this.state.actindicatorfecthQslCard} position= {'top'} transparent={true}  onRequestClose={() => console.log('Close was requested')}>
             {/* <KeyboardAvoidingView behavior="padding"  > */}
              <View style={{ 
                   padding:10, 
                  backgroundColor : 'rgba(0,0,0,0.85)',
                   marginTop: 210,
                   left: 105,
                   right: 15,
                   width: 185,
                   height: 35,
                   paddingVertical: 5,
                 //   position: 'absolute',
                   
                 //  alignItems: 'center',
                   borderRadius: 12                       
                    }}>
                   <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15}}>Fetching QSL Card ...</Text>
                   
                  

                    </View>
                {/* </KeyboardAvoidingView > */}
                   
                      </Modal>


             <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>


                <TouchableOpacity
                    onPress={() => this.gotoQslScanScreen()}
                    style = {styles.capture} >
                    <Text style={{fontSize: 14}}> Go Back </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.onSuccess_test()}
                    style = {styles.capture} >
                    <Text style={{fontSize: 14}}> test </Text>
                </TouchableOpacity>
            </View>





            </View>

            }






}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black'
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20
    },
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777',
    },
    textBold: {
      fontWeight: '500',
      color: '#000',
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
      padding: 16,
    },
  });
  
   const mapStateToProps = state => {
      return {  
         // sqsoqslalreadyscan: state.sqso.qslAlreadyScan,
        //   sqsoqslscan: state.sqso.currentQso.qslscan.body.message,
        //   sqsoqslscanerror: state.sqso.currentQso.qslscan.body.error
          
       };
  };
  
  
  const mapDispatchToProps = {
      getQslScan
      
     }
  
  export default connect(mapStateToProps, mapDispatchToProps)(QslScanQR);
