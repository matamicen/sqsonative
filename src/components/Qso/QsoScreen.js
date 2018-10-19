import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Modal, StyleSheet,
     TouchableHighlight, Platform,TouchableOpacity, KeyboardAvoidingView, PermissionsAndroid, Alert,
    Dimensions  } from 'react-native';
import { connect } from 'react-redux';
import { fetchPeople,cambioqsotype, closeModalConfirmPhoto, cameraPermissionTrue,
        cameraPermissionFalse, audiorecordingPermissionFalse, audiorecordingPermissionTrue,
        newqsoactiveTrue, newqsoactiveFalse, resetQso, openModalRecording, setLocation } from '../../actions';
import QsoHeader from './QsoHeader';
import MediaFiles from './MediaFiles';
import RecordAudio2 from './RecordAudio2';
import Muestro from './Muestro';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
//import {  Permissions } from 'expo';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from './NoInternetModal';
import Permissions from 'react-native-permissions'




class QsoScreen extends Component {

    constructor(props) {
        super(props);

    this.width = Dimensions.get('window').width; //full width
    this.height = Dimensions.get('window').height; //full height
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true,
          pickerSelection: 'Default',
          pickerDisplayed: false,
          photoConfirm: false,
          endQsoModal: false,
          actindicatorpostQsoNew: false,
          modalRecording: false,
          nointernet: false    
       
        };
      }

  

  static navigationOptions = {
      tabBarLabel: 'Qso',


      tabBarIcon: ({ tintColor }) => {
        return (<Image
            style={{ width: 31, height: 31  }}
            source={require('../../images/qsoicon3.png')}/>);}


  }

  componentWillReceiveProps(nextProps) {
    
    console.log("El valor de confirmPhotoModal: " + nextProps.sqsomodalconfirmphoto);
    console.log("El valor de sqsoactindicatorpostqsonew : " + nextProps.sqsoactindicatorpostqsonew);
    this.setState({
      photoConfirm: nextProps.sqsomodalconfirmphoto,
      actindicatorpostQsoNew: nextProps.sqsoactindicatorpostqsonew, 
      heightPhotoConfirm: nextProps.sqsomodalconfirmphotoheight
     
    });

    this.setState({
      pickerDisplayed: nextProps.sqsomodalrecording    
    });

    // this.setState({
    //   actindicatorpostQsoNew: nextProps.sqsoactindicatorpostqsonew 
    // });
}
  async componentDidMount() {

    console.log("COMPONENT did mount QSO Screen!");

   
       }

    
    
    
      toggleRecordingModal = async () => {
    //       console.log("llamo togglepicker")

    //       const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    //       if (status === 'granted') this.props.audiorecordingPermissionTrue();
    //      else this.props.audiorecordingPermissionFalse();


    //   //  this.setState({pickerDisplayed: !this.state.pickerDisplayed})

          this.props.openModalRecording();

     }


     checkInternetOpenRecording = async () => {
      if (await hasAPIConnection())
      {
        Permissions.request('microphone').then(response => {
          // Returns once the user has chosen to 'allow' or to 'not allow' access
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          console.log('Microphone Permiso: '+response);
        if (response==='authorized')
          {
            this.toggleRecModal();
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
        
     
      });
        
     
        
        
      

      }
        else
          this.setState({nointernet: true});

     }
     toggleRecModal = async () => {

      // if (await hasAPIConnection())
      // {

      console.log('ejecuta toggleRecordModal');
     
      if(this.state.modalRecording)
      {
          this.setState({
            modalRecording: false
          });
        }else{
          this.setState({
            modalRecording: true
        });}

      // }
      // else this.setState({nointernet: true});
    }

    closeModalPhotoConfirmation = () => {
        // console.log("closeModalPhotoConfirmation");
         this.props.closeModalConfirmPhoto();
        // this.navigateRoot();
        this.setState({
          photoConfirm: false
        });
    
      
  }

  CancelEndQsoModal = () => {
    this.setState({
      endQsoModal: false
    });
}

OpenEndQsoModal = () => {
  this.setState({
    endQsoModal: true
  });
}
  

    gotoCameraScreen = async () => {

  //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //     if (status === 'granted') this.props.cameraPermissionTrue();
  //        else this.props.cameraPermissionFalse(); 
  //     // this.setState({ permissionsGranted: status === 'granted' });
  //   //  console.log("status DidMount"+status);

  //       console.log("va camara Screen ejecuto Screen Orientation");
  //       if ( Platform.OS === 'ios')
  //       {
  //            Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.ALL);
  //       }

  if (await hasAPIConnection())
  {
    // this.requestCameraPermission().then((hasPermission) => {
    //   if (!hasPermission) return;
  
    Permissions.request('camera').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('Camera Permiso: '+response);
    if (response==='authorized')
      {
      this.props.closeModalConfirmPhoto('image');
      this.props.navigation.navigate("CameraScreen2");
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
    
 
  });
    


  }else this.setState({nointernet: true});
      
   }

  navigateRoot = () => {
    const navigateToScreen2 = NavigationActions.navigate({
      routeName:'Root'
     
    })

    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Root', params: {  } })],
      });
   

    // The navigateToScreen2 action is dispatched and new navigation state will be calculated in basicNavigationReducer here ---> https://gist.github.com/shubhnik/b55602633aaeb5919f6f3c15552d1802
    this.props.navigation.dispatch(resetAction)
}
navigateReset = () => {
// const navigation = addNavigationHelpers({
//   dispatch: this.navigationStore.dispatch,
//   state: this.navigationStore.state,
// });
this.props.navigation.dispatch(NavigationActions.init());
}

newQso = async () => {

  // this.requestLocationPermission().then((hasPermission) => {
  //   if (!hasPermission) return;

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //        const initialPosition = JSON.stringify(position);
  //   //     console.log('location:' + initialPosition);
         
  //        console.log('latitude:' + position.coords.latitude + ' longitude:' + position.coords.longitude);
  //        this.props.setLocation(position.coords.latitude,position.coords.longitude);
         
  //     },
  //     (error) => {
  //       alert(error.message);
  //       this.props.setLocation(0,0);

          
  //       },
  //     { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
  //  );

  //   this.props.newqsoactiveTrue();
  //   this.props.resetQso();

  // });


//  Permissions.check('location').then(response => {
//     // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
//     if (response==='undetermined')
//     {
//       console.log('Location undetermined');

//       Alert.alert(
//         'Help the ham community to calculate the QSO distance.',
//         'You can do it by accepting the Location permission. Thanks, 73!',
//         [
//           {
//             text: 'Ok, thanks',
//             onPress: () => console.log('Just ok'),
//             style: 'cancel',
//           },
         
//         ],
//        )

//     }
//   })

if (await hasAPIConnection())
{

  Permissions.request('location', { type: 'always'}).then(response => {
    // Returns once the user has chosen to 'allow' or to 'not allow' access
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    console.log('location Permiso: '+response);

  if (response==='authorized')
    {
    // this.props.closeModalConfirmPhoto('image');
    // this.props.navigation.navigate("CameraScreen2");

    navigator.geolocation.getCurrentPosition(
          (position) => {
             const initialPosition = JSON.stringify(position);
        //     console.log('location:' + initialPosition);
             
             console.log('latitude:' + position.coords.latitude + ' longitude:' + position.coords.longitude);
             this.props.setLocation(position.coords.latitude,position.coords.longitude);
             
          },
          (error) => {
            alert(error.message);
            this.props.setLocation(0,0);
    
              
            },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
       );
    
        this.props.newqsoactiveTrue();
        this.props.resetQso();

     }

    if (response==='denied' &&  Platform.OS !== 'android')
    {
     Alert.alert(
      'You denied the access to the Location',
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
      'You denied the access to the Location',
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
    'You do not have access to the Location',
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
  

});

}else this.setState({nointernet: true});
      

  
  
}

// requestLocationPermission = () =>  {
//   if (Platform.OS !== 'android') {
//     return Promise.resolve(true);
//   }

//   const rationale = {
//     'title': 'Location Permission',
//     'message': 'Location needs access to your Location to calculate the QSO distance.'
//   };

//   return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, rationale)
//     .then((result) => {
//       console.log('Permission result:', result);
//       return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
//     });
// }


// requestCameraPermission = () =>  {
//   if (Platform.OS !== 'android') {
//     return Promise.resolve(true);
//   }

//   const rationale = {
//     'title': 'Camera Permission',
//     'message': 'superQso needs access to your Camera to take photos in the QSO.'
//   };

//   return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, rationale)
//     .then((result) => {
//       console.log('Permission result:', result);
//       return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
//     });
// }



endQso = () => {

  this.props.newqsoactiveFalse();
  this.props.resetQso();
  this.CancelEndQsoModal();
  
}

closeNoInternetModal = () => {
  this.setState({nointernet: false}); 
}



    render() { console.log("RENDER qso Screen" );

        return   <View style={{flex: 1}}>
               
             
               <View style={{flex: 0.3}}>
              <QsoHeader />


              {/* <ActivityIndicator  animating={this.state.actindicatorpostQsoNew} size="large" color='orange' /> */}
              

 <Modal visible={this.state.actindicatorpostQsoNew} position= {'top'} transparent={true}  onRequestClose={() => console.log('Close was requested')}>
             {/* <KeyboardAvoidingView behavior="padding"  > */}
              <View style={{ 
                   padding:10,
                   margin: 15, 
                  backgroundColor : 'rgba(0,0,0,0.85)',
                   marginTop: 210,
                    left: 95,
                  //  right: 15,
                  // alignItems: 'center',
                  // alignContent: 'center',
                   width: 155,
                   height: 45,
                   paddingVertical: 5,
                 //   position: 'absolute',
                   
                 //  alignItems: 'center',
                   borderRadius: 12                       
                    }}>
                   <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 15, marginTop: 5}}>Processing ...</Text>
                   
                  

                    </View>
                {/* </KeyboardAvoidingView > */}
                   
                      </Modal>

                  <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />



              
              <Modal visible ={this.state.modalRecording} animationType={"slide"} transparent={true} onRequestClose={() => console.log('Close was requested')}>
              
                    <View style={{ margin:10,
                          padding:10, 
                        backgroundColor : 'rgba(0,0,0,0.85)',
                        marginTop: 120,
                       //  bottom: 150,
                         left: 55,
                         right: 55,
                         height: 180,
                         position: 'absolute',
                         alignItems: 'center',
                         borderRadius: 12,
                                               
                          }}>
                         
                          <RecordAudio2 closeModal={this.toggleRecModal.bind(this)}  />

                     
                           {/* <Button onPress={() => this.toggleRecModal()} title="Cierro" /> */}
                           {/* <TouchableHighlight  onPress={() => this.cancelRecording()} >
                             <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                          </TouchableHighlight> */}
                       
                          </View>
                         
              </Modal>
  
            {/* position= {'top'} animationType={"slide"} */}
             <Modal visible={this.state.photoConfirm} position= {'top'} transparent={true}  onRequestClose={() => console.log('Close was requested')}>
             {/* <KeyboardAvoidingView behavior="padding"  > */}
              <View style={{ 
                   padding:10, 
                  backgroundColor : 'rgba(0,0,0,0.85)',
                   marginTop: 50,
                   left: 15,
                   right: 35,
                   width: this.width-35,
                   
                   height: this.props.heightPhotoConfirm,
                   paddingVertical: 5,
                 //   position: 'absolute',
                   
                 //  alignItems: 'center',
                   borderRadius: 12                       
                    }}>
                   
                     <Muestro /> 
                  
                     {/* style={{ paddingBottom: 4}} */}
                     <View style={{ marginTop: 10}}>
                      <TouchableOpacity  onPress={() => this.closeModalPhotoConfirmation()} >
                       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    </View>
                {/* </KeyboardAvoidingView > */}
                   
                      </Modal>
                     

              <Modal visible ={this.state.endQsoModal} animationType={"slide"} transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{ margin:20,
                         padding:20, 
                         backgroundColor: 'rgba(0,0,0,0.85)',
                         bottom: 230,
                         left: 20,
                         right: 20,
                         position: 'absolute',
                         alignItems: 'center',
                         borderRadius: 12                      
                          }}>
                          
                    <Text style={{ fontWeight: 'bold', alignItems: 'center', fontSize: 16, color: 'white' , marginBottom:10}}>Are you sure to END this {this.props.qsotype} mode ? </Text>
                
                    <View style={{ flexDirection: 'row', flex: 1}}>
                    <TouchableHighlight  onPress={() => this.endQso()} style={{ flex: 0.7, paddingTop: 20, paddingBottom: 4, paddingHorizontal: 10}}>
                      <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 14}}>End this {this.props.qsotype} mode</Text>
                    </TouchableHighlight>

                    <TouchableHighlight  onPress={() => this.CancelEndQsoModal()} style={{flex: 0.3, paddingTop: 20, paddingBottom: 4}}>
                      <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 14}}>Cancel</Text>
                    </TouchableHighlight>

                    </View>
                    </View>

               
               </Modal>
               {/* width:this.width-10 */}
               </View>
                
               <View style={{flex: 0.6 }} >
               {/* { this.props.sqsonewqsoactive ? */}
            
               <MediaFiles /> 
               {/* :
                null } */}
                  
               </View  >
             
              
            

               
               <View style={{flexDirection: 'row', flex:0.1, marginTop:6}}> 

                <View style={{flex:0.5, marginTop:5, marginLeft: 5}}> 
               
               { this.props.sqsonewqsoactive ?
               <TouchableOpacity   onPress={ () => this.OpenEndQsoModal() }>
                  
                    <Image source={require('../../images/removecircle.png')}  style={{width: 29, height: 29 } } 
                 resizeMode="contain" />    
               {/* <Text style={{ fontSize: 12, color: '#999'}}>EndQso</Text>           */}
               <Text style={{ fontSize: 12, color: 'black'}}>EndQso</Text>    
                </TouchableOpacity> 
                : 
                <TouchableOpacity   onPress={ () => this.newQso() }>
                  
                <Image source={require('../../images/iaddcircle.png')}  style={{width: 29, height: 29 } } 
             resizeMode="contain" />    
             {/* <Text style={{ fontSize: 12, color: '#999'}}>NewQso</Text>           */}
             <Text style={{ fontSize: 12, color: 'black'}}>NewQso</Text>         
              </TouchableOpacity> }

              </View>





                { (this.props.sqsosqlrdsid !== '') ?
                 <View style={{flex:0.25, alignItems: 'flex-end', marginTop:5}}> 

               <TouchableOpacity   onPress={ () => this.checkInternetOpenRecording() }>
                    <Image source={require('../../images/mic.png')}  style={{width: 29, height: 29 } } 
                 resizeMode="contain" />    
                 <Text style={{ fontSize: 12, color: 'black'}}>Record</Text>          
                </TouchableOpacity>
                </View>
                : null }

               
               {/* <Button onPress={() => this.props.navigation.navigate("QslScanScreen")} title="QslScan" /> */}
               {/* <Button onPress={() => this.gotoCameraScreen()} title="Camera" /> */}
               
               { (this.props.sqsosqlrdsid !== '') ?
                <View style={{flex:0.25, alignItems: 'center', marginTop:5}}> 
               <TouchableOpacity  onPress={ () => this.gotoCameraScreen() }>
                    <Image source={require('../../images/camera.png')}  style={{width: 29, height: 29  } } 
                 resizeMode="contain" /> 
                  <Text  style={{ fontSize: 12, color: 'black'}}>Photo</Text>             
                </TouchableOpacity>
                </View>
                : null }

               
               </View>
             
             

            </View>
       
     } 

 }

 

 const mapStateToProps = state => {
    // return {  isTransitioning: state.nav.isTransitioning,
    //     index: state.nav.routes[0].index,
    //     routes: state.nav.routes[0].params,
    //     sqso: state.sqso };
        return {  
          sqsomodalconfirmphotoheight: state.sqso.currentQso.modalconfirmphotoHeight,
          sqsomodalconfirmphoto: state.sqso.currentQso.modalconfirmphoto,
          sqsomodalrecording: state.sqso.currentQso.modalrecording,
          sqsosqlrdsid: state.sqso.currentQso.sqlrdsId,
          sqsoactivityindicatorImage: state.sqso.currentQso.activityindicatorImage,
          sqsonewqsoactive: state.sqso.newqsoactive,
          qsotype: state.sqso.currentQso.qsotype,
          sqsoactindicatorpostqsonew: state.sqso.currentQso.activityindicatorPostQsoNew,
         
         };
};


const mapDispatchToProps = {
    fetchPeople,
    cambioqsotype,
    closeModalConfirmPhoto,
    cameraPermissionTrue,
    cameraPermissionFalse,
    audiorecordingPermissionFalse,
    audiorecordingPermissionTrue,
    newqsoactiveTrue,
    newqsoactiveFalse,
    resetQso,
    openModalRecording,
    setLocation  
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoScreen);