import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, ScrollView, Modal, PermissionsAndroid
,Platform } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
// import QsoHeader from './QsoHeader';
import { getQslScan } from '../../actions';
// import MediaImages from './MediaImages';
// import Likes from './Likes';
// import Comments from './Comments';
import QRCodeScanner from 'react-native-qrcode-scanner';

class QslScanQR extends Component {
  // static navigationOptions = {
  //     tabBarLabel: 'Qsl ScanQR'

     



  // }

  constructor(props) {
    super(props);
    
    this.scantype = '';

    this.state = {
      conta: 0,
      actindicatorfecthQslCard: false,
      scanQR: false,
      hasPermission: undefined
      
    };
  }




  gotoQslScanScreen = async (param) => {
    console.log('llamo Screen '+ param);

       if (param==='qslScan')
           this.props.navigation.navigate("QslScanScreen");
        else
           this.props.navigation.navigate("QsoLink");
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
       await this.props.getQslScan(e.data,this.scantype);
       this.setState({actindicatorfecthQslCard: false})
      if (this.scantype==='mainQsoLink')
         this.gotoQslScanScreen('mainQsoLink');
       else
         this.gotoQslScanScreen('qslScan');
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
         console.log('ESCANEO TEST y el PARAMETRO es:'+this.scantype);
          this.setState({actindicatorfecthQslCard: true})
        //  console.log('el codigo Scaneado es: ' +e.data);
        
        //  await this.props.getQslScan('2734ee49-bdc0-11e8-ae0b-061cacc9b2a2');
        await this.props.getQslScan('0e5866a5-c97d-11e8-ae0b-061cacc9b2a2',this.scantype);
         this.setState({actindicatorfecthQslCard: false})
         this.gotoQslScanScreen();
       //   this.setState({scanQR: !this.state.scanQR})
  
          
     
         //   this.setState({scanQR: !this.state.scanQR})
       }

     render() { console.log("RENDER QSL SCAN SCREEN!" );
     const { params } = this.props.navigation.state;
     this.scantype = params ? params.scantype : null;
    
    console.log("QSL SCAN parametros: "+JSON.stringify(this.scantype) );
  


return   <View style={{flex: 1}}>
      
    { (!this.state.actindicatorfecthQslCard) &&

    <View style={{flex: 0.9, justifyContent: 'center'}}>
      <QRCodeScanner
               onRead={this.onSuccess.bind(this)}
             // onRead={() => this.ScanQSL2(this)}
           
  
            >
                   

            </QRCodeScanner>


             <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'center'}}>


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


             <Modal visible={this.state.actindicatorfecthQslCard} position= {'top'} transparent={true}  onRequestClose={() => console.log('Close was requested')}>
             {/* <KeyboardAvoidingView behavior="padding"  > */}
              <View style={{ 
                   padding:10, 
                  backgroundColor : 'rgba(0,0,0,0.85)',
                   marginTop: 210,
                   left: 95,
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
      padding: 5,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 5
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
