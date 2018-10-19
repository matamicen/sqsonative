import React, { Component } from 'react';
import { Text, Image, View, Button, StyleSheet, TextInput, TouchableOpacity, Keyboard,
     ActivityIndicator, KeyboardAvoidingView , AsyncStorage, Modal, ScrollView, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { setQra, setUrlRdsS3, resetQso, followersAlreadyCalled, newqsoactiveFalse} from '../../actions';
//import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
//import {  Permissions } from 'expo';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from '../Qso/NoInternetModal';

Amplify.configure(awsconfig);


class LoginForm extends Component {
//   static navigationOptions = {
//       tabBarLabel: 'Profile'

//   }


constructor(props) {
    super(props);

    this.usernotfound = false;
    this.internet = false;


    this.width = Dimensions.get('window').width; //full width
    this.height = Dimensions.get('window').height; //full height
    
    this.state = {
   
     username: '',
     password: '',
     indicator: 0,
     loginerror: 0,
     nointernet: false,
     showloginForm: false
     
    };
  }

  async componentDidMount() {

    console.log("COMPONENT did mount LOGINFORM");


  if (await hasAPIConnection())
  {
    console.log('SI hay internet: ');
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    //  console.log("status DidMount loginFORM"+status);
// Compruebo si ya estaba logueado con sus credenciales
    try {
      session = await Auth.currentSession();
      console.log("Su token DID MOUNT es: " + session.idToken.jwtToken);

      const { identityId } = await Auth.currentCredentials();
      console.log('la credencial es:' + identityId);
      var res = identityId.replace(":", "%3A");
      console.log('la credencial RES:' + res);
      this.props.setUrlRdsS3('https://s3.amazonaws.com/sqso/protected/'+res+'/');

      // busco en sotrage local porque la session esta activa pero la sesion no me dice el username
      // entonces busco el username ultimo logueado del storage local y se lo seteo a QRA del store
      try {
        const value = await AsyncStorage.getItem('username');
        if (value !== null){
          // We have data!!
          console.log("PASO por AUTENTICACION y trajo del LOCAL STORAGE: " + value);
          // seteo el usuario logueado en store 
         this.props.setQra(value);
          //Si ya estaba logueado lo envio a la pantalla inicial
          console.log("Tiene credenciales LoginForm, ya estaba logueado!!");
     //     this.props.getFollowingFollowers();
          this.props.followersAlreadyCalled(false);
          this.props.navigation.navigate("AppNavigator2");
        }
      } catch (error) {
        // Error retrieving data
      }



    }
    catch (e) {
      console.log('No tiene credenciales LoginForm', e);
      this.setState({showloginForm: true});
      // Handle exceptions
    }

  }else {
          console.log('lo siento no hay Internet');
          this.setState({nointernet: true});
         }
     
 
       }

       closeNoInternetModal = () => {
        this.setState({nointernet: false}); 
      }

signIn = async () => {

 

    // await this.props.checkInternet().then((data) => {
    //         console.log('devuelve checkInternet: '+data); 
    //         this.internet = data; 
    //         if (data)
    //           console.log('hay internet');
    //          else this.setState({username: 'NO hay internet'});
    // });

   Keyboard.dismiss();
   this.setState({indicator: 1, loginerror: 0});

//if(this.internet){
  if (await hasAPIConnection())
  {

 //this.setState({indicator: 1, loginerror: 0});
  console.log("username: "+this.state.username.toUpperCase() + "password: "+ this.state.password);
    await Auth.signIn(this.state.username.toUpperCase(), this.state.password)
      .then(() => { console.log('entro!');
      this.usernotfound = false;
    })
      .catch(err => {console.log('error:', err.code);
             this.setState({ loginerror: 1, indicator: 0});
             this.usernotfound = true;})

if (!this.usernotfound)
  {  try {
      const { identityId } = await Auth.currentCredentials();
      console.log('PASO POR SIGNIN la credencial es:' + identityId);
      var res = identityId.replace(":", "%3A");
      this.props.setUrlRdsS3('https://s3.amazonaws.com/sqso/protected/'+res+'/');
      this.props.resetQso();
      this.props.newqsoactiveFalse();
      
      this.props.followersAlreadyCalled(false);
   //   this.props.getFollowingFollowers();
      console.log('la credencial RES:' + res);
    }
    catch (e) {
      console.log('caught error', e);
      // Handle exceptions
    }
    session = await Auth.currentSession();
    console.log("PASO POR SIGNIN token: " + session.idToken.jwtToken);
    
    // seteo el usuario logueado en store 
    this.props.setQra(this.state.username.toUpperCase());
    // guardo en local storage el username
    try {
      await AsyncStorage.setItem('username', this.state.username.toUpperCase());
    } catch (error) {
      // Error saving data
    }
    
   

    this.setState({indicator: 0});
     this.props.navigation.navigate("AppNavigator2");

     }
    // this.setState({indicator: 0});
    // Keyboard.dismiss();

   // }
    
    }
    else 
      { this.setState({indicator: 0}); 
        this.setState({nointernet: true});
        
      }
   
  }

  SignUpForm = async () => {

    if (await hasAPIConnection())
       this.props.navigation.navigate("SignUpScreen");

    else 
      { this.setState({indicator: 0}); 
        this.setState({nointernet: true});
        
      }

  }

  ForgotPassword = async () => {

    if (await hasAPIConnection())
       this.props.navigation.navigate("ForgotScreen")

    else 
      { this.setState({indicator: 0}); 
        this.setState({nointernet: true});
        
      }

  }
   
    render() { console.log("LoginForm Screen");
   
        return (
          <View>
            {(this.state.showloginForm) ?
            
               <View style={styles.container}>
   
       
               <View style={{flexDirection: 'row',  justifyContent: 'space-around',   padding:5,
                        opacity: this.state.indicator }} >
                  
                    <ActivityIndicator   animating={true} size="large" color='orange' />
                    
                 </View>
                 <View style={{ justifyContent: 'space-around',   padding: 10,
                        opacity: this.state.loginerror }}>
                        <Text style={{ color: '#ff3333', textAlign: 'center', }}> Login error, try again
                        </Text>
                   </View>

                   <ScrollView >
                   {/* <ScrollView style={{width: this.width}}> */}
                   <View style={{flex:1, alignItems: 'center'}} >
               
               <TextInput 
                  placeholder="qra"
                  onFocus={() => this.setState({ loginerror: 0})}
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.passwordRef.focus()} 
                  style={styles.input}
                  value={this.state.username}
                    onChangeText={(text) => this.setState({username: text})} />
               
               <TextInput
                 ref={passwordRef => this.passwordRef = passwordRef}
                 placeholder="password"
                 onFocus={() => this.setState({ loginerror: 0})}
                 underlineColorAndroid='transparent'
                 placeholderTextColor="rgba(255,255,255,0.7)"
                 returnKeyType="go"
                 autoCapitalize="none"
                 autoCorrect={false}
                 secureTextEntry
                 style={styles.input} 
                 value={this.state.password}
                 onChangeText={(text) => this.setState({password: text})}
                
                 />

         
                
                 <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.signIn()} >
                    <Text style={styles.buttonText} >LOGIN</Text>
                 </TouchableOpacity>

                 <View style={{flex:1, flexDirection: 'row'}}>
                 <View style={{flex:0.4,  height: 45, alignItems: 'center'}}>
                 <TouchableOpacity style={{marginTop: 10}} onPress={ () => this.SignUpForm()} >
                    <Text style={styles.buttonText2} >SignUp</Text>
                 </TouchableOpacity>
                 </View>
                 <View style={{flex:0.6, height: 45, alignItems: 'center'}}>
                 <TouchableOpacity  style={{marginTop: 10}} onPress={ () => this.ForgotPassword()} >
                    <Text style={styles.buttonText2} >Forgot Password</Text>
                 </TouchableOpacity>
                 </View>

                 
               </View>

 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
 <Text style={styles.buttonText2} >  </Text>
   </View>
               </ScrollView>

               <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />


             </View> 
             :
             <View style={styles.container}>
                  <Text style={{ color: '#273c75', textAlign: 'center', fontSize: 18, marginTop: 30 }}> Loading ...
                        </Text>
                        {/* <Image source={require('../../images/loading.jpg')}  style={{width: 250, height: 160, marginTop: 100  } }  /> */}
                
             </View>


            }
           
           </View>
           
        );
       
     } 

 }

 const styles = StyleSheet.create({
  container: {
    padding: 20,
    
    
      },
  input: {
    height: 40,    
    backgroundColor: 'rgba(255,255,255,0.2)',
   // borderWidth: 1, 
    borderRadius: 22,
    marginBottom: 18,
    width: 280,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center'
    
          },
  buttonContainer:{
      backgroundColor: '#2980b9',
      paddingVertical: 15,
      borderRadius: 22,
      width: 280
      },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
           },
           buttonText2: {
       //     textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700'
           
                   },
   activityindicator: {
    flexDirection: 'row',
     justifyContent: 'space-around',
   padding: 10
  
   },
   title2: {
    fontSize: 22,
    color: '#FFF',    
    marginTop: 100,
  //  width: 100,
    textAlign: 'center',
    opacity: 0.7
    
          },

        });


 const mapStateToProps = state => {
    return {  };
};


const mapDispatchToProps = {
    setQra,
    setUrlRdsS3,
    resetQso,
    followersAlreadyCalled,
    newqsoactiveFalse
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);