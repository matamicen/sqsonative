import React, { Component } from 'react';
import { Text, Image, View, Button, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight, Keyboard,
     ActivityIndicator, KeyboardAvoidingView, DatePickerAndroid, DatePickerIOS,
    Platform, Modal, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
//import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { setQra, setUrlRdsS3 } from '../../actions';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from '../Qso/NoInternetModal';

Amplify.configure(awsconfig);


class SignUpForm extends Component {
//   static navigationOptions = {
//       tabBarLabel: 'Profile'

//   }


constructor(props) {
    super(props);

    this.usernotfound = false;
    this.error = false;
    this.qraAlreadySignUp = '';
    
    this.state = {
   
     qra: '',
     email: '',
     birthdate: 'birthdate',
     password: '',
     passwordConfirm: '',
     country: '',
     lastname: '',
     firstname: '',
     indicator: 0,
     loginerror: 0,
     errormessage: '',
     chosenDate: new Date() ,
     pickerDateIOS: false,
     day: 0,
     month: 0,
     year: 0,
     confirmSignup: false,
     confirmationcode: '',
     confirmationcodeError: 0,
     color: 'red',
     heightindicator: 0,
     heighterror: 0,
     nointernet: false
     
    };
  }

  componentDidMount() {

    console.log("COMPONENT did mount SignupForm");

 
       }

       setDate = async (newDate)  => 
        {
          
       //   console.log(date +"/"+ month +"/"+year);
        this.setState({chosenDate: newDate})
      }

      

      setDateIOS = ()  => {
          var day = this.state.chosenDate.getDate();
          var month =this.state.chosenDate.getMonth() + 1;
          var year = this.state.chosenDate.getFullYear();
        this.setState({birthdate: month+"/"+day+"/"+year});
        this.setState({day: day, month: month, year: year});
        this.close_birthdate_modalIOS();
        
      }


    date_picker = async ()  => {
      Keyboard.dismiss();
      if (Platform.OS == 'ios')
      {
        this.setState({pickerDateIOS: true});
      }
      else
      {
        this.date_picker_android();
      }
      
   }      

close_birthdate_modalIOS = () => {
  this.setState({pickerDateIOS: false})
}

close_confirmSignup = () => {
  this.setState({confirmSignup: false})
}

 date_picker_android = async ()  => {

  try {
    const {action, year, month, day} = await DatePickerAndroid.open({
      // Use `new Date()` for current date.
      // May 25 2020. Month 0 is January.
      date: new Date(2020, 4, 25)
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      // Selected year, month (0-11), day
      
      console.log("dia: "+day + " mes: "+month+" año: "+year);
    
      this.setState({birthdate: month+1+"/"+day+"/"+year});
      this.setState({day: day, month: month+1, year: year})
    }
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
 }

 birthday_convert = () => {

  if (this.state.day<10) dia = '0'+this.state.day;
  else dia = this.state.day;
  if (this.state.month<10) mes = '0'+this.state.month;
  else mes = this.state.mes;
  fechanac = mes+'/'+dia+'/'+this.state.year;
  console.log('fecha cumple:'+fechanac);
  return fechanac;

 }

signUp = async () => {
 
  if (await hasAPIConnection())
  {   
    this.setState({heightindicator: 35, indicator: 1, heighterror: 0, loginerror: 0});
   
   
          if (this.state.password!==this.state.passwordConfirm)
          {

            this.setState({errormessage: 'The Passwords are not identical',heightindicator: 0, indicator: 0, heighterror: 25, loginerror: 1});
            this.error = true;
            this.passwordRef.focus();
          }

          if (this.state.password.length<6)
          {

            this.setState({errormessage: 'The Passwords must have 6 characters at least',heightindicator: 0, indicator: 0, heighterror: 25, loginerror: 1});
            this.error = true; 
            this.passwordRef.focus();
          }

          if (this.state.qra=='')
          {

            this.setState({errormessage: 'The QRA is empty',heightindicator: 0, indicator: 0, heighterror: 25, loginerror: 1});
            this.error = true;
            this.qraRef.focus();
          }

     console.log("variable error:" + this.error);


     if (!this.error && this.qraAlreadySignUp===this.state.qra)
           this.setState({heightindicator: 0, indicator: 0, confirmSignup: true});
      else
      {

      if (!this.error){

        fechanac = this.birthday_convert();

          Auth.signUp({username: this.state.qra.toUpperCase(), 
          password: this.state.password,
          attributes: {
          email: this.state.email,
          birthdate: fechanac
        
          }
        })
      .then(() => {console.log('SignUp ok!: ');
                  this.qraAlreadySignUp = this.state.qra;
                  this.setState({heightindicator: 0, indicator: 0, confirmSignup: true});})
      .catch (err => {console.log('SignUp error: ', err.message)
                     this.setState({errormessage: 'SignUp error: '+err.message,heightindicator: 0,  indicator: 0,heighterror: 25,  loginerror: 1 });
                     Keyboard.dismiss();
              })
          
      }
      else {
        this.error = false;
        Keyboard.dismiss();
      }
    }

      }else 
      { 
        this.setState({indicator: 0}); 
        this.setState({nointernet: true});
      }
  
   
  }

  resendCode = async () => {
    Keyboard.dismiss();
    if (await hasAPIConnection())
    {  
  

    this.setState({ indicator:1,confirmationcodeError:0 });

   await Auth.resendSignUp(this.state.qra.toUpperCase())
                  .then(() => { console.log('Resend Ok!')
                  this.setState({ errormessage2:'Your confirmation code has been sent!',color: 'blue',heightindicator: 0,  indicator: 0, confirmationcodeError:1 });
                })
                  .catch(err => {console.log('Error sending the confirmation code, try again.', err)
                  this.setState({errormessage2: 'Error sending the confirmation code, try again.',color: 'red',heightindicator: 0,  indicator: 0, confirmationcodeError:1 });
                
                
                });

    this.setState({ heightindicator: 0,indicator:0 });
  }else 
  { this.close_confirmSignup();
    this.setState({indicator: 0}); 
    this.setState({nointernet: true});
  }

  }


  signInAfterConfirmed = async () => {

    await Auth.signIn(this.state.qra.toUpperCase(), this.state.password)
    .then(() =>  {console.log('entro!')
    this.usernotfound = false;
  
  })
    .catch(err => {console.log('error:', err.code)
    this.usernotfound = true;
  });


  if (!this.usernotfound)
  {  try {
      const { identityId } = await Auth.currentCredentials();
      console.log('PASO POR SIGNIN la credencial es:' + identityId);
      var res = identityId.replace(":", "%3A");
      this.props.setUrlRdsS3('https://s3.amazonaws.com/sqso/protected/'+res+'/');
      console.log('la credencial RES:' + res);
    }
    catch (e) {
      console.log('caught error', e);
      // Handle exceptions
    }
    session = await Auth.currentSession();
    console.log("PASO POR SIGNIN token: " + session.idToken.jwtToken);
    
    // seteo el usuario logueado en store 
    this.props.setQra(this.state.qra.toUpperCase());
    // guardo en local storage el username
    try {
      await AsyncStorage.setItem('username', this.state.qra.toUpperCase());
    } catch (error) {
      // Error saving data
    }
    
   

    this.setState({indicator: 0});
     this.props.navigation.navigate("AppNavigator2");
  

     }



  }

  confirmSignup = async () => {
     Keyboard.dismiss();

  if (await hasAPIConnection())
   {  
     this.setState({confirmationcodeError: 0,heightindicator: 35,  indicator:1});
     
     
     
     Auth.confirmSignUp(this.state.qra.toUpperCase(),this.state.confirmationcode)
    .then(() => { console.log('SignUp confirmed ok!: ') 
                  this.close_confirmSignup();
                  this.signInAfterConfirmed();
                  // this.setState({indicator:0});
     

                  // this.props.navigation.navigate("AppNavigator2");
                                   })
    .catch (err => {console.log('SignUp confirmed error: ', err);
    this.setState({errormessage2: 'Confirmation failed! Please enter the code again',color: 'red',  confirmationcodeError: 1, indicator:0 });
                   
  })
}else 
{ this.close_confirmSignup();
  this.setState({indicator: 0, heightindicator: 0}); 
  this.setState({nointernet: true});
}


  }

  closeNoInternetModal = () => {
    this.setState({nointernet: false}); 
  }

  
   
    render() { console.log("LoginForm Screen");
               console.log("qra: "+this.state.qra + " email:"+ this.state.email + 
               " birthdate: "+this.state.birthdate +
              " password: " +this.state.password + 
            "passwordConfirm: "+this.state.passwordConfirm);
   
        return (
         //   <KeyboardAvoidingView behavior="padding" style={{ justifyContent: 'space-around'}}>
       
         <View style={styles.container}>
          <View style={{   padding: 3, marginTop: 10, height: this.state.heightindicator,
                        opacity: this.state.indicator }} >
                  
                    <ActivityIndicator  animating={true} size="large" color='orange' />
                  
                 </View>
                
                 <View style={{   padding: 3, height: this.state.heighterror, width: 340,
                        opacity: this.state.loginerror }}>
                        <Text style={{ color: 'red', textAlign: 'center', }}> {this.state.errormessage}
                        </Text>
                   </View>
   <ScrollView contentContainerStyle={styles.contentContainer}>   
         
         <KeyboardAvoidingView behavior="padding"        >
              {/* <View style={styles.container}> */}
              
               {/* <View style={{flexDirection: 'row', justifyContent: 'space-around',   padding: 3, marginTop: 5, */}
               
                   <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 5, marginBottom: 4  }}>SignUp Form</Text>
               <TextInput 
                  ref={qraRef => this.qraRef = qraRef}
                  placeholder="qra"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.firstname.focus()} 
                  style={styles.input}
                  value={this.state.qra}
                    onChangeText={(text) => this.setState({qra: text})} />

                  <TextInput 
                  ref={firstname => this.firstname  = firstname }
                  placeholder="first name"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.lastname.focus()} 
                  style={styles.input}
                  value={this.state.firstname }
                    onChangeText={(text) => this.setState({firstname : text})} />

                     <TextInput 
                  ref={lastname => this.lastname = lastname}
                  placeholder="last Name"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.emailRef.focus()} 
                  style={styles.input}
                  value={this.state.lastname}
                    onChangeText={(text) => this.setState({lastname: text})} />

                    <TextInput 
                  ref={emailRef => this.emailRef = emailRef}
                  placeholder="email"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.birthdatedRef.focus()} 
                  style={styles.input}
                  value={this.state.email}
                    onChangeText={(text) => this.setState({email: text})} />


  
            <TouchableOpacity  style={styles.birthdateContainer} onPress={ () => this.date_picker()} >
            <Text  style={styles.birthdateText} 
            ref={birthdatedRef => this.birthdatedRef = birthdatedRef}> {this.state.birthdate}</Text>
          
                    {/* <TextInput 
                  ref={birthdatedRef => this.birthdatedRef = birthdatedRef}
                  placeholder="birthdate"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.passwordRef.focus()} 
                  style={styles.input}
                  value={this.state.birthdate}
               
                  onChangeText={(text) => this.setState({birthdate: text})} /> */}
                   
                    </TouchableOpacity>

                        <TextInput 
                  ref={countryRef => this.countryRef  = countryRef }
                  placeholder="country"
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => this.passwordRef.focus()} 
                  style={styles.input}
                  value={this.state.country}
                    onChangeText={(text) => this.setState({country: text})} />
               
               <TextInput
                 ref={passwordRef => this.passwordRef = passwordRef}
                 placeholder="password"
                 underlineColorAndroid='transparent'
                 placeholderTextColor="rgba(255,255,255,0.7)"
                 returnKeyType="go"
                 autoCapitalize="none"
                 autoCorrect={false}
                 onSubmitEditing={() => this.passwordConfRef.focus()} 
                 secureTextEntry
                 style={styles.input} 
                 value={this.state.password}
                 onChangeText={(text) => this.setState({password: text})}
                
                 />

                  <TextInput
                 ref={passwordConfRef => this.passwordConfRef = passwordConfRef}
                 placeholder="password confirm"
                 underlineColorAndroid='transparent'
                 placeholderTextColor="rgba(255,255,255,0.7)"
                 returnKeyType="go"
                 autoCapitalize="none"
                 autoCorrect={false}
                 secureTextEntry
                 style={styles.input} 
                 value={this.state.passwordConfirm}
                 onChangeText={(text) => this.setState({passwordConfirm: text})}
                
                 />

                

                 <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.signUp()} >
                    <Text style={styles.buttonText}> SignUp </Text>
                 </TouchableOpacity>

                 <TouchableOpacity  style={{marginTop: 10}} onPress={ () => this.props.navigation.navigate("Root")} >
                    <Text style={styles.buttonText2} >Login Screen</Text>
                 </TouchableOpacity>

                  </KeyboardAvoidingView> 

                 {/* <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.date_picker_android()} >
                    <Text style={styles.buttonText}> DateAndroid </Text>
                 </TouchableOpacity> */}

                 
                     


 {/* animationType={"slide"} */}
   <Modal visible ={this.state.pickerDateIOS}  transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{
                      //  margin:20,
                          padding:20, 
                          backgroundColor:  '#475788',
                          top: 170,
                          left: 30,
                          right: 30,
                          position: 'absolute',
                                                    
                        //  alignItems: 'center'                      
                          }}>
                          
                   
                       <DatePickerIOS mode='date'
                        style={{backgroundColor: '#475788'}}
                        date={this.state.chosenDate}
                        onDateChange={this.setDate}
                      />

                    <View style={{flex: 1, flexDirection: 'row'}}>

                    <TouchableOpacity  onPress={() => this.close_birthdate_modalIOS()} style={{ paddingTop: 4, paddingBottom: 4, flex: 0.5}}>
                      <Text style={{ color: '#999', fontSize: 16}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => this.setDateIOS() } style={{ paddingTop: 4, paddingBottom: 4, flex: 0.5}}>
                      <Text style={{ color: '#999', fontSize: 16}}>SELECT</Text>
                    </TouchableOpacity>
                    </View>
                    
                    </View>

               
               </Modal>


  <Modal visible ={this.state.confirmSignup}  transparent={true} onRequestClose={() => console.log('Close was requested')}>
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

                                                    
                          alignItems: 'center'                      
                          }}>
                          
                  <Text style={{ color: '#FFFFFF', fontSize: 18, padding: 10 }}>We have sent the confirmation code to your email. Please enter the code to activate the account.</Text>
                  <TextInput 
                  placeholder="confirmation code"
                  onFocus={() => this.setState({ confirmationcodeError: 0})}
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.inputConfirmation}
                  value={this.state.confirmationcode}
                  onChangeText={(text) => this.setState({confirmationcode: text})} />

                  <View style={{ justifyContent: 'space-around',   padding: 3,
                        opacity: this.state.confirmationcodeError }}>
                        <Text style={{ color: this.state.color, textAlign: 'center', fontSize: 16, width: 290 }}> {this.state.errormessage2}
                        </Text>
                   </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>

                    <TouchableOpacity  onPress={() => this.close_confirmSignup()} style={{ paddingTop: 8, paddingBottom: 4, flex: 0.5}}>
                      <Text style={{ color: '#999', fontSize: 14}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.resendCode() } style={{ paddingTop: 8, paddingBottom: 4, flex: 0.5, alignItems: 'flex-start'}}>
                      <Text style={{ color: '#999', fontSize: 14}}>Resend Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => this.confirmSignup() } style={{ paddingTop: 4, paddingBottom: 4, flex: 0.5, alignItems: 'flex-end'}}>
                      <Text style={{ color: 'white', fontSize: 18}}>CONFIRM</Text>
                    </TouchableOpacity>
                    </View>
                    
                    </View>

               
               </Modal>


</ScrollView>  
<NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />
             
            </View>
            
            
           
           
        );
       
     } 

 }

 const styles = StyleSheet.create({
  container: {
     padding: 0,
     flex: 1,
    backgroundColor: '#3498db',
    alignItems: 'center'
    
      },
      contentContainer:{
        width: 340,
        alignItems: 'center'


      },
  input: {
    height: 38,    
    width: 270,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 17,
    color: '#FFF',
    fontSize: 16,
    borderRadius: 22,
    paddingHorizontal: 10
          },
          inputConfirmation: {
            height: 40,    
            width: 250,
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginBottom: 5,
            color: '#FFF',
            fontSize: 16,
            borderRadius: 22,
            paddingHorizontal: 10
                  },
  buttonContainer:{
      backgroundColor: '#2980b9',
      paddingVertical: 15,
      borderRadius: 22,
      width: 270,
      },
  birthdateContainer:{
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 10,
        height: 37,
        width: 270,
        marginBottom: 17,
        paddingHorizontal: 8,
        borderRadius: 22
               },
   birthdateText:{
    color: '#FFF',
    fontSize: 16,
    opacity: 0.7,
    height: 37
         
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
                 fontWeight: '700',
                 marginLeft: 5
                
                        },  
   activityindicator: {
    flexDirection: 'row',
     justifyContent: 'space-around',
   padding: 10
  
   }

        });


 const mapStateToProps = state => {
    return {  };
};


const mapDispatchToProps = {
  setQra,
  setUrlRdsS3 
   }

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
