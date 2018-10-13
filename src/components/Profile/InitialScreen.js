import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, TouchableOpacity,  StyleSheet, Platform, 
  PermissionsAndroid, Alert  } from 'react-native';
import { connect } from 'react-redux';
import Login from './Login';
import Amplify, { Auth, API, Storage } from 'aws-amplify'
import awsconfig from '../../aws-exports'
//import Qra from './../Qso/Qra';
import QraProfile from './../Qso/QraProfile';
import { closeModalConfirmPhoto } from '../../actions';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from '../Qso/NoInternetModal';
import Permissions from 'react-native-permissions'


Amplify.configure(awsconfig);

class InitialScreen extends Component {
  static navigationOptions = {
      tabBarLabel: 'Profile',

      tabBarIcon: ({ tintColor }) => {
        return (<Image
            style={{ width: 31, height: 31  }}
            source={require('../../images/profile1.png')}/>);}

  }

  constructor(props) {
    super(props);
    
    this.state = {
        nointernet: false
    };
  }

  gotoLoginScreen = () => {
    console.log("va camara Login Screen");
   
    this.props.navigation.navigate("Root");
  
}

signOut = async () => {

  if (await hasAPIConnection())
  {
    
    await Auth.signOut()
      .then(data => console.log(JSON.stringify(data)))
      .catch(err => console.log(err));

      try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        this.setState({ tok: session.idToken.jwtToken })
      }
      catch (e) {
        console.log('caught error', e);
        console.log("va camara Login Screen");
   
        this.props.navigation.navigate("Root");
        // Handle exceptions
      }

    } else
    this.setState({nointernet: true});

  }


  closeNoInternetModal = () => {
    this.setState({nointernet: false}); 
  }

  gotoCameraScreen = async () => {
    if (await hasAPIConnection())
    {

      Permissions.request('camera').then(response => {
        // Returns once the user has chosen to 'allow' or to 'not allow' access
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        console.log('Camera Permiso: '+response);
      if (response==='authorized')
        {
        this.props.closeModalConfirmPhoto('profile');
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
      
          } else
          this.setState({nointernet: true});
        
     }


     requestCameraPermission = () =>  {
      if (Platform.OS !== 'android') {
        return Promise.resolve(true);
      }
    
      const rationale = {
        'title': 'Camera Permission',
        'message': 'superQso needs access to your Camera to take photos in the QSO.'
      };
    
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, rationale)
        .then((result) => {
          console.log('Permission result:', result);
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
    }

   
    render() { console.log("InitialScreen Screen");
    console.log("InitialScreen Screen profile.jpg"+this.props.rdsurl+'/profile/profile.jpg');
   
        return <View style={{ marginTop: Platform.OS === 'ios' ? 20 : 13, marginLeft: 10}}>
          
               
             {/* <Text style={{fontSize: 30}}>
             Profile Screen
             </Text> */}

              {/* <TouchableOpacity style={{marginLeft:40, marginTop: 30}} onPress={ () => this.gotoLoginScreen() }>
                    <Image source={require('../../images/camera.png')}  style={{width: 33, height: 33  } } 
                 resizeMode="contain" /> 
                  <Text  style={{ fontSize: 12, color: '#999'}}>Login</Text>             
                </TouchableOpacity> */}

             <View style={{flexDirection: 'row'}}>
                  {/* <Qra qra={this.props.qra} imageurl={this.props.rdsurl+'profile/profile.jpg?'+this.props.sqsoprofilepicrefresh } />   */}
                  <QraProfile qra={this.props.qra} imageurl={this.props.rdsurl+'profile/profile.jpg?'+this.props.sqsoprofilepicrefresh } />  
                 
                  <TouchableOpacity style={{marginLeft:18, marginTop: 13}} onPress={ () => this.gotoCameraScreen() }>
                    <Image source={require('../../images/camera.png')}  style={{width: 23, height: 23  } } 
                 resizeMode="contain" /> 
                  <Text  style={{ fontSize: 14, color: '#999'}}>Edit</Text>             
                </TouchableOpacity>

                  {/* ProfileScreen */}
 
              </View> 

                 <TouchableOpacity style={{marginTop: 15}} onPress={ () => this.signOut()} >
                    <Text style={styles.buttonText2} >SignOut</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={{marginTop: 15}} onPress={ () => this.props.navigation.navigate("Search")} >
                    <Text style={styles.buttonText2} >You are following: {this.props.followings.length}</Text>
                 </TouchableOpacity>

                  <TouchableOpacity style={{marginTop: 15}} onPress={ () => this.props.navigation.navigate("Search")} >
                    <Text style={styles.buttonText2} >You have {this.props.followers.length} followers</Text>
                 </TouchableOpacity>

                  {/* <TouchableOpacity style={{marginTop: 10}} onPress={ () => this.gotoLoginScreen() } >
                    <Text style={styles.buttonText2} >Login Screen</Text>
                 </TouchableOpacity> */}

                 <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />
               

            </View>
       
     } 

 }

 const styles = StyleSheet.create({
    container: {
      padding: 20
        },
    input: {
      height: 40,    
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 10,
      color: '#FFF',
      fontSize: 16,
      paddingHorizontal: 10
            },
    buttonContainer:{
        backgroundColor: '#2980b9',
        paddingVertical: 15
        },
    buttonText: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700'
             },
             buttonText2: {
              //     textAlign: 'center',
                   color: 'grey',
                   fontSize: 16,
                   fontWeight: '500'
                  
                          },
     activityindicator: {
      flexDirection: 'row',
       justifyContent: 'space-around',
     padding: 10
    
     }
  
          });


 const mapStateToProps = state => {
    return { 
      qra: state.sqso.qra,
      followers: state.sqso.currentQso.followers,
      followings: state.sqso.currentQso.followings,
      rdsurl: state.sqso.urlRdsS3,
      sqsoprofilepicrefresh: state.sqso.profilePicRefresh
    };
};


const mapDispatchToProps = {
  closeModalConfirmPhoto
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(InitialScreen);