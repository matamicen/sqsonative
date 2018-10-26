import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, Button, ActivityIndicator, TouchableOpacity, ScrollView, Modal,
   Platform, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
// import QsoHeader from './QsoHeader';
import QsoHeaderLink from './QsoHeaderLink';
import { getQslScan,linkQsos, updateLinkQso } from '../../actions';
// import MediaImages from './MediaImages';
import MediaImagesLink from './MediaImagesLink';
// import Likes from './Likes';
// import Comments from './Comments';
import CommentsLink from './CommentsLink';
import LikesLink from './LikesLink';
import { getDateQslScan } from '../../helper';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from '../Qso/NoInternetModal';
import Permissions from 'react-native-permissions'
import { ConsoleLogger } from '@aws-amplify/core';


class QsoLink extends Component {
  static navigationOptions = {
      tabBarLabel: 'Qso Link',

    //   tabBarIcon: ({ tintColor }) => {
    //     return (<Image
    //         style={{ width: 28, height: 28  }}
    //         source={require('../../images/qrcodescan.png')}/>);}

  }

  constructor(props) {
    super(props);
    this.micPermission = false;
    this.camPermission = false;


    this.width = Dimensions.get('window').width; //full width
    this.height = Dimensions.get('window').height; //full height

    this.state = {
      conta: 0,
      actindicatorfecthQslCard: false,
      scanQR: false,
      nointernet: false,
      qsoToLink: false,
      linkCodes: false
     
      
    };
  }


  componentWillReceiveProps(nextProps) {
    
  
if (nextProps.sqsoqsolinkcodes.code!==0)
    this.setState({
      linkCodes: true    
    })
    else
    this.setState({
      linkCodes: false    
    })
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

closeNoInternetModal = () => {
  this.setState({nointernet: false}); 
}

gotoQslScanScreen = async () => {

    this.props.navigation.navigate("QslScanScreen");

}

checkInternetScanQR = async (param) => {
  console.log('entro a PEDIR PERMISOS');
  if (await hasAPIConnection())
  {
    Permissions.request('microphone').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('Microphone Permiso: '+response);
    if (response==='authorized')
      {
        console.log('entro a PEDIR PERMISOS esta AUTORIZADO!!!');
        this.micPermission = true;
        // this.props.navigation.navigate("QslScanQR");
       }

      if (response==='denied' &&  Platform.OS !== 'android')
      {
       Alert.alert(
        'You denied the access to the Microphone',
        'In order to Authorize choose Open Settings',
        [
          {
            text: 'No, thanks',
            onPress: () => console.log('Permission denied'),
            style: 'cancel',
          },
          { text: 'Open Settings',
             onPress: Permissions.openSettings },
          
        ],
       )
      }

      if (response==='restricted' &&  Platform.OS === 'android')
      {
       Alert.alert(
        'You denied the access to the Microphone',
        'In order to Authorize go to settings->Apps->superQso->Permissions',
        [
          {
            text: 'Ok',
            onPress: () => console.log('ok'),
            style: 'cancel',
          },
          
        ],
       )
      }
      
   

    if (response==='restricted' &&  Platform.OS !== 'android')
    {
     Alert.alert(
      'You do not have access to the Microphone',
      'Cause: it is not supported by the device or because it has been blocked by parental controls',
      [
        {
          text: 'Ok',
          onPress: () => console.log('ok'),
          style: 'cancel',
        },
        
      ],
     )
    }


    Permissions.request('camera').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('Camera Permiso: '+response);
    if (response==='authorized')
      {
      // this.props.closeModalConfirmPhoto('image');
      // this.props.navigation.navigate("CameraScreen2");
      this.camPermission = true;  
      
       }

      if (response==='denied' &&  Platform.OS !== 'android')
      {
       Alert.alert(
        'You denied the access to the Camera',
        'In order to Authorize choose Open Settings',
        [
          {
            text: 'No, thanks',
            onPress: () => console.log('Permission denied'),
            style: 'cancel',
          },
          { text: 'Open Settings',
             onPress: Permissions.openSettings },
          
        ],
       )
      }

      if (response==='restricted' &&  Platform.OS === 'android')
      {
       Alert.alert(
        'You denied the access to the Camera',
        'In order to Authorize go to settings->Apps->superQso->Permissions',
        [
          {
            text: 'Ok',
            onPress: () => console.log('ok'),
            style: 'cancel',
          },
          
        ],
       )
      }
      
   

    if (response==='restricted' &&  Platform.OS !== 'android')
    {
     Alert.alert(
      'You do not have access to the Camera',
      'Cause: it is not supported by the device or because it has been blocked by parental controls',
      [
        {
          text: 'Ok',
          onPress: () => console.log('ok'),
          style: 'cancel',
        },
        
      ],
     )
    }


        if (this.micPermission && this.camPermission && param==='mainqsoscan')

          this.props.navigation.navigate('QslScanQR', {
              scantype: 'mainQsoLink'
              
            });

            if (this.micPermission && this.camPermission && param==='linkqsoscan')

            this.props.navigation.navigate('QslScanQR', {
                scantype: 'linkQso'
                
              });

              if (this.micPermission && this.camPermission && param==='linkqsos')
                 this.props.linkQsos(this.props.sqsoqsolink);
             

              
        
            

 
  });

    


 
  });

  
 

    
    
  

  }
    else
      this.setState({nointernet: true});

 }

 closeLinksCodesModal = () => {
  jsonError = {code: 0, message: " "}
  this.props.updateLinkQso(jsonError,'linkQsoError');
 // this.setState({linkCodes: false}); 
}
   
render() { console.log("RENDER QSL SCAN SCREEN!" );
console.log('Dimensions Width:'+this.width);
console.log("sqsoqsolink" );
console.log(this.props.sqsoqsolink);
// console.log('lisandro');
// console.log(this.props.sqsoqslscan.links);

return   <View style={{flex: 1}}>
   
            
       
      
       <View style={{flex: 0.29, width: this.width-10, marginLeft: 3, marginRight: 3, marginTop: 10}}>
         
            <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />
       

           
                {(this.props.sqsoqsolink.qra) &&
                <QsoHeaderLink qra={this.props.sqsoqsolink.qra} mode={this.props.sqsoqsolink.mode} band={this.props.sqsoqsolink.band} type={this.props.sqsoqsolink.type}
                                          profilepic={this.props.sqsoqsolink.profilepic} avatarpic={this.props.sqsoqsolink.avatarpic} qras={this.props.sqsoqsolink.qras} datetime={this.props.sqsoqsolink.datetime} 
                                      />
                }

             

       
          
        </View>

       <View style={{ flex: 0.60, width: this.width-10, marginLeft: 3, marginRight: 3, marginTop: 6}}>

       {/* <View style={{marginLeft: 30}}>
      
        {(this.props.sqsoqsolinkscanerror===1) &&  
            <Text style={{color:"grey"}}> {this.props.sqsoqsolink.message}</Text> 
             }

        </View> */}



        <Modal visible ={this.state.linkCodes}  transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{
                      //  margin:20,
                          padding:20, 
                          backgroundColor:  '#475788',
                          top: 90,
                          left: 30,
                          right: 30,
                          position: 'absolute',
                          borderBottomLeftRadius: 22,
                          borderBottomRightRadius: 22,
                          borderTopLeftRadius: 22,
                          borderTopRightRadius: 22,
                                                    
                        //  alignItems: 'center'                      
                          }}>
          

                    <View style={{flex: 1, alignItems: 'center'}}>

                    {/* <Image source={require('../../images/noInternet.png')}  style={{width: 60, height: 60 } } 
                      resizeMode="contain" />  */}

                     <Text style={{ color: '#FFFFFF', fontSize: 14, padding: 10 }}>{this.props.sqsoqsolinkcodes.message}</Text>

                    <TouchableOpacity  onPress={() =>  this.closeLinksCodesModal() } style={{ paddingTop: 8, paddingBottom: 4, flex: 0.5}}>
                      <Text style={{ color: '#999', fontSize: 16}}>OK</Text>
                    </TouchableOpacity>
                    
                    </View>
                    
                    </View>

               
               </Modal>





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

        


       <ScrollView contentContainerStyle={styles.contentContainer}>
  
       
           {
           
             (this.props.sqsoqsolink.links) && 
            
            
                  this.props.sqsoqsolink.links.map((m, i) =>    
                    // console.log('loop links: '+m.idqsos +' ' +m.mode)
                    <View   key={i} style={{ paddingBottom: 7, felx:1, backgroundColor: 'white', borderRadius: 12, marginTop: 18, marginLeft: 2 }}>
                    {/* <Text>  idqso: {m.idqsos}</Text>
                    <Text>  mode: {m.mode}</Text>
                    <Text>  band: {m.band}</Text> */}
                    <QsoHeaderLink qra={m.qra} mode={m.mode} band={m.band} type={m.type}
                                   profilepic={m.profilepic} qras={m.qras} datetime={m.datetime} 
                               />
                               
                 
                    
                  </View> 
           ) //este parentesis es del map del loop de arriba
              
             }

       </ScrollView>
       
       </View>
      
       

       
     

       <View style={{ flexDirection: 'row', flex:0.06, marginTop:7, marginLeft: 15}}> 
       
      
       {/* this.scanQR() */}
    <View style={{flex: 1, flexDirection: 'row' }}>


       <View style={{flex: 0.27 }}>
                <TouchableOpacity  style={{}}  onPress={ () => this.checkInternetScanQR('mainqsoscan')  }>
                <Text style={{ fontSize: 12, color: 'orange', marginLeft: 25}}>Step 1</Text> 
                  <Image source={require('../../images/qrcodescan.png')}  style={{width: 27, height: 27, marginLeft: 29 } } 
              resizeMode="contain" />    
                      <Text style={{ fontSize: 12, color: '#999'}}>Scan your QSO</Text>  
              </TouchableOpacity> 
          </View>
      
          {/* <View style={{flex: 0.12, alignItems: 'flex-start' }}>
       { (this.props.sqsoqsolink.qra) &&
        
          <Image source={require('../../images/arrowGreen.png')}  style={{width: 50, height: 50, marginTop: 6 } } 
       resizeMode="contain" />    
       
          } 
      </View>  */}
       <View style={{flex: 0.30, alignItems: 'flex-start' }}>
       { (this.props.sqsoqsolink.qra) &&
           <TouchableOpacity  style={{}}  onPress={ () => this.checkInternetScanQR('linkqsoscan')  }>
           <Text style={{ fontSize: 12, color: 'orange', marginLeft: 24}}>Step 2</Text> 
          <Image source={require('../../images/qrcodescan.png')}  style={{width: 27, height: 27, marginLeft: 25 } } 
       resizeMode="contain" />    
       <Text style={{ fontSize: 12, color: '#999'}}>Add a Qso to Link</Text>   
          
         </TouchableOpacity> 
          } 
      </View>  

       <View style={{flex: 0.22, alignItems: 'center' }}>
       {  (this.props.sqsoqsolink.links) &&
         (this.props.sqsoqsolink.links.length>0) &&
           <TouchableOpacity  style={{}}  onPress={ () => this.checkInternetScanQR('linkqsos')  }>
           <Text style={{ fontSize: 12, color: 'orange', marginLeft: 0}}>Ready</Text> 
          <Image source={require('../../images/link2.png')}  style={{width: 24, height: 24 } } 
       resizeMode="contain" />    
       <Text style={{ fontSize: 12, color: '#999'}}>Link</Text>   
          
         </TouchableOpacity> 
          }
         
      </View>  
       
     <View style={{flex: 0.15, alignItems: 'flex-end', marginRight: 5}}>
      <TouchableOpacity
                  onPress={() => this.gotoQslScanScreen()}
                  style = {{ marginTop: 12}} >
                  <Image source={require('../../images/arrow_back_grey.png')}  style={{width: 27, height: 27 } } 
                  resizeMode="contain" />    
                  <Text style={{fontSize: 12}}> Back </Text>
              </TouchableOpacity>

      </View>
      


      </View>

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
  contentContainer:{
   
  

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
        sqsoqsolink: state.sqso.currentQso.qsolink,
      //  sqsoqslscanbody: state.sqso.currentQso.qslscan.body,
      
        sqsoqsolinkscanerror: state.sqso.currentQso.qsolink.error,
        sqsoqsolinkcodes: state.sqso.currentQso.qsolinkCodes
        
     };
};


const mapDispatchToProps = {
    getQslScan,
    linkQsos,
    updateLinkQso
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoLink);