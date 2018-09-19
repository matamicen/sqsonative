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

class QslScanScreen extends Component {
  static navigationOptions = {
      tabBarLabel: 'Qsl Scan',

      tabBarIcon: ({ tintColor }) => {
        return (<Image
            style={{ width: 28, height: 28  }}
            source={require('../../images/qrcodescan.png')}/>);}

  }

  constructor(props) {
    super(props);
    
    this.state = {
      conta: 0,
      actindicatorfecthQslCard: false,
      scanQR: false
      
    };
  }


  navigate = () => {
    const navigateToScreen2 = NavigationActions.navigate({
      routeName:'Root'
     
    })

    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Root' })],
      });
   

    // The navigateToScreen2 action is dispatched and new navigation state will be calculated in basicNavigationReducer here ---> https://gist.github.com/shubhnik/b55602633aaeb5919f6f3c15552d1802
    this.props.navigation.dispatch(resetAction)
}

ScanQSL = async () => {
    if (this.state.conta===1) {
      this.setState({actindicatorfecthQslCard: true})
      await this.props.getQslScan("555d1aa6-81f8-11e8-ae0b-061cacc9b2a0");
      this.setState({actindicatorfecthQslCard: false})
  
  }
     else this.props.getQslScan("555d1aa6-81f8-11e8-ae0b-061cacc9b2a2");
                                 

      this.setState({conta: 1})

   }

   scanQR = async function() {
    this.setState({scanQR: !this.state.scanQR})
  //  Linking
  //     .openURL('https://www.cnn.com')
  //     .catch(err => console.error('An error occured', err));

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
     this.setState({scanQR: !this.state.scanQR})
     

    //   this.setState({scanQR: !this.state.scanQR})
  }
   
render() { console.log("RENDER QSL SCAN SCREEN!" );

return   <View style={{flex: 1}}>
      {this.state.scanQR &&
      <QRCodeScanner
               onRead={this.onSuccess.bind(this)}
             // onRead={() => this.ScanQSL2(this)}
              topContent={
                <Text style={styles.centerText}>
                  Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                </Text>
              }
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
              }
            />
            }
            
       
      
       <View style={{flex: 0.26}}>
      
        <QsoHeader />


  
        </View>

       <View style={{ flex: 0.64, width: 600, marginLeft: 3, marginRight: 3, marginTop: 30}}>

       <View style={{marginLeft: 30}}>
      
        {(this.props.sqsoqslscanerror===1) &&  
            <Text style={{color:"grey"}}> Sorry, the scanned Qsl Card doesn't exist.</Text> 
             }

        </View>

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

        


       <ScrollView>
       {/* { (this.props.qslalreadyscan==='full') ? */}
        <MediaImages mostrar='image'/> 
       {/* :
        null } */}
       <MediaImages mostrar='audio'/> 

       <Likes />
       <Comments />

       </ScrollView>
       
       </View>
      
       

       
     

       <View style={{ flexDirection: 'row', flex:0.1, marginTop:9, justifyContent: 'center'}}> 
       
      
       {/* this.scanQR() */}
       <TouchableOpacity  style={{marginLeft:10}}  onPress={ () =>  this.props.navigation.navigate("QslScanQR") }>
          
            <Image source={require('../../images/qrcodescan.png')}  style={{width: 33, height: 33, marginLeft: 9 } } 
         resizeMode="contain" />    
         <Text style={{ fontSize: 12, color: '#999'}}>Scan Qsl</Text>          
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
        sqsoqslscan: state.sqso.currentQso.qslscan.body.message,
        sqsoqslscanerror: state.sqso.currentQso.qslscan.body.error
        
     };
};


const mapDispatchToProps = {
    getQslScan
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(QslScanScreen);