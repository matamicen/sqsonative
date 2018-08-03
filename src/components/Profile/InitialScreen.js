import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, TouchableOpacity,  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Login from './Login';
import Amplify, { Auth, API, Storage } from 'aws-amplify'
import awsconfig from '../../aws-exports'
import Qra from './../Qso/Qra';


Amplify.configure(awsconfig);

class InitialScreen extends Component {
  static navigationOptions = {
      tabBarLabel: 'Profile'

  }

  gotoLoginScreen = () => {
    console.log("va camara Login Screen");
   
    this.props.navigation.navigate("Root");
  
}

signOut = async () => {
    
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

    


  }

   
    render() { console.log("InitialScreen Screen");
   
        return <View style={{marginTop: 50, marginLeft: 10}}>
          
               
             {/* <Text style={{fontSize: 30}}>
             Profile Screen
             </Text> */}

              {/* <TouchableOpacity style={{marginLeft:40, marginTop: 30}} onPress={ () => this.gotoLoginScreen() }>
                    <Image source={require('../../images/camera.png')}  style={{width: 33, height: 33  } } 
                 resizeMode="contain" /> 
                  <Text  style={{ fontSize: 12, color: '#999'}}>Login</Text>             
                </TouchableOpacity> */}

             <View style={{flexDirection: 'row'}}>
                  <Qra qra={this.props.qra} imageurl="https://randomuser.me/api/portraits/med/women/80.jpg" />  
                  
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

                  <TouchableOpacity style={{marginTop: 10}} onPress={ () => this.gotoLoginScreen() } >
                    <Text style={styles.buttonText2} >Login Screen</Text>
                 </TouchableOpacity>
               

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
    };
};


const mapDispatchToProps = {
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(InitialScreen);