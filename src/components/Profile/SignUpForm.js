import React, { Component } from 'react';
import { Text, Image, View, Button, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight, Keyboard,
     ActivityIndicator, KeyboardAvoidingView, DatePickerAndroid, DatePickerIOS,
    Platform, Modal, ScrollView, FlatList } from 'react-native';
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
     country: 'country',
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
     nointernet: false,
     pickerCountry: false
     
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

          if (this.state.country=='country')
          {

            this.setState({errormessage: 'You must enter your Country',heightindicator: 0, indicator: 0, heighterror: 25, loginerror: 1});
            this.error = true;
            this.countryRef.focus();
          }

          if (this.state.birthdate=='birthdate')
          {

            this.setState({errormessage: 'You must enter your Birthdate',heightindicator: 0, indicator: 0, heighterror: 25, loginerror: 1});
            this.error = true;
            this.birthdateRef.focus();
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

  setPickerValue = (value) => {
         this.setState({country: value, pickerCountry: false });

  }

  toggleCountryPicker = () => {
   
    this.setState({ pickerCountry: !this.state.pickerCountry });
}
   
    render() { console.log("LoginForm Screen");
               console.log("qra: "+this.state.qra + " email:"+ this.state.email + 
               " birthdate: "+this.state.birthdate +
              " password: " +this.state.password + 
            "passwordConfirm: "+this.state.passwordConfirm);


            const pickerValues = [ 
              {"name": "Afghanistan", "code": "AF"}, 
              {"name": "land Isl.", "code": "AX"}, 
              {"name": "Albania", "code": "AL"}, 
              {"name": "Algeria", "code": "DZ"}, 
              {"name": "American Samoa", "code": "AS"}, 
              {"name": "Andorra", "code": "AD"}, 
              {"name": "Angola", "code": "AO"}, 
              {"name": "Anguilla", "code": "AI"}, 
              {"name": "Antarctica", "code": "AQ"}, 
              {"name": "Antigua and Barbuda", "code": "AG"}, 
              {"name": "Argentina", "code": "AR"}, 
              {"name": "Armenia", "code": "AM"}, 
              {"name": "Aruba", "code": "AW"}, 
              {"name": "Australia", "code": "AU"}, 
              {"name": "Austria", "code": "AT"}, 
              {"name": "Azerbaijan", "code": "AZ"}, 
              {"name": "Bahamas", "code": "BS"}, 
              {"name": "Bahrain", "code": "BH"}, 
              {"name": "Bangladesh", "code": "BD"}, 
              {"name": "Barbados", "code": "BB"}, 
              {"name": "Belarus", "code": "BY"}, 
              {"name": "Belgium", "code": "BE"}, 
              {"name": "Belize", "code": "BZ"}, 
              {"name": "Benin", "code": "BJ"}, 
              {"name": "Bermuda", "code": "BM"}, 
              {"name": "Bhutan", "code": "BT"}, 
              {"name": "Bolivia", "code": "BO"}, 
              {"name": "Bosnia and Herzegovina", "code": "BA"}, 
              {"name": "Botswana", "code": "BW"}, 
              {"name": "Bouvet Isl.", "code": "BV"}, 
              {"name": "Brazil", "code": "BR"}, 
              {"name": "British Indian Ocean Territory", "code": "IO"}, 
              {"name": "Brunei Darussalam", "code": "BN"}, 
              {"name": "Bulgaria", "code": "BG"}, 
              {"name": "Burkina Faso", "code": "BF"}, 
              {"name": "Burundi", "code": "BI"}, 
              {"name": "Cambodia", "code": "KH"}, 
              {"name": "Cameroon", "code": "CM"}, 
              {"name": "Canada", "code": "CA"}, 
              {"name": "Cape Verde", "code": "CV"}, 
              {"name": "Cayman Isl.", "code": "KY"}, 
              {"name": "Central African Republic", "code": "CF"}, 
              {"name": "Chad", "code": "TD"}, 
              {"name": "Chile", "code": "CL"}, 
              {"name": "China", "code": "CN"}, 
              {"name": "Christmas Isl.", "code": "CX"}, 
              {"name": "Cocos (Keeling) Isl.", "code": "CC"}, 
              {"name": "Colombia", "code": "CO"}, 
              {"name": "Comoros", "code": "KM"}, 
              {"name": "Congo", "code": "CG"}, 
              {"name": "Congo", "code": "CD"}, 
              {"name": "Cook Isl.", "code": "CK"}, 
              {"name": "Costa Rica", "code": "CR"}, 
              {"name": "Cote D Ivoire", "code": "CI"}, 
              {"name": "Croatia", "code": "HR"}, 
              {"name": "Cuba", "code": "CU"}, 
              {"name": "Cyprus", "code": "CY"}, 
              {"name": "Czech Republic", "code": "CZ"}, 
              {"name": "Denmark", "code": "DK"}, 
              {"name": "Djibouti", "code": "DJ"}, 
              {"name": "Dominica", "code": "DM"}, 
              {"name": "Dominican Republic", "code": "DO"}, 
              {"name": "Ecuador", "code": "EC"}, 
              {"name": "Egypt", "code": "EG"}, 
              {"name": "El Salvador", "code": "SV"}, 
              {"name": "Equatorial Guinea", "code": "GQ"}, 
              {"name": "Eritrea", "code": "ER"}, 
              {"name": "Estonia", "code": "EE"}, 
              {"name": "Ethiopia", "code": "ET"}, 
              {"name": "Falkland Isl.", "code": "FK"}, 
              {"name": "Faroe Isl.", "code": "FO"}, 
              {"name": "Fiji", "code": "FJ"}, 
              {"name": "Finland", "code": "FI"}, 
              {"name": "France", "code": "FR"}, 
              {"name": "French Guiana", "code": "GF"}, 
              {"name": "French Polynesia", "code": "PF"}, 
              {"name": "French Southern Territories", "code": "TF"}, 
              {"name": "Gabon", "code": "GA"}, 
              {"name": "Gambia", "code": "GM"}, 
              {"name": "Georgia", "code": "GE"}, 
              {"name": "Germany", "code": "DE"}, 
              {"name": "Ghana", "code": "GH"}, 
              {"name": "Gibraltar", "code": "GI"}, 
              {"name": "Greece", "code": "GR"}, 
              {"name": "Greenland", "code": "GL"}, 
              {"name": "Grenada", "code": "GD"}, 
              {"name": "Guadeloupe", "code": "GP"}, 
              {"name": "Guam", "code": "GU"}, 
              {"name": "Guatemala", "code": "GT"}, 
              {"name": "Guernsey", "code": "GG"}, 
              {"name": "Guinea", "code": "GN"}, 
              {"name": "Guinea-Bissau", "code": "GW"}, 
              {"name": "Guyana", "code": "GY"}, 
              {"name": "Haiti", "code": "HT"}, 
              {"name": "Heard Isl. and Mc. Isl.", "code": "HM"}, 
              {"name": "Holy See (Vatican City State)", "code": "VA"}, 
              {"name": "Honduras", "code": "HN"}, 
              {"name": "Hong Kong", "code": "HK"}, 
              {"name": "Hungary", "code": "HU"}, 
              {"name": "Iceland", "code": "IS"}, 
              {"name": "India", "code": "IN"}, 
              {"name": "Indonesia", "code": "ID"}, 
              {"name": "Iran", "code": "IR"}, 
              {"name": "Iraq", "code": "IQ"}, 
              {"name": "Ireland", "code": "IE"}, 
              {"name": "Isle of Man", "code": "IM"}, 
              {"name": "Israel", "code": "IL"}, 
              {"name": "Italy", "code": "IT"}, 
              {"name": "Jamaica", "code": "JM"}, 
              {"name": "Japan", "code": "JP"}, 
              {"name": "Jersey", "code": "JE"}, 
              {"name": "Jordan", "code": "JO"}, 
              {"name": "Kazakhstan", "code": "KZ"}, 
              {"name": "Kenya", "code": "KE"}, 
              {"name": "Kiribati", "code": "KI"}, 
              {"name": "Korea Democratic", "code": "KP"}, 
              {"name": "Korea Republic", "code": "KR"}, 
              {"name": "Kuwait", "code": "KW"}, 
              {"name": "Kyrgyzstan", "code": "KG"}, 
              {"name": "Lao Dem. Rep.", "code": "LA"}, 
              {"name": "Latvia", "code": "LV"}, 
              {"name": "Lebanon", "code": "LB"}, 
              {"name": "Lesotho", "code": "LS"}, 
              {"name": "Liberia", "code": "LR"}, 
              {"name": "Libyan Arab Jamahiriya", "code": "LY"}, 
              {"name": "Liechtenstein", "code": "LI"}, 
              {"name": "Lithuania", "code": "LT"}, 
              {"name": "Luxembourg", "code": "LU"}, 
              {"name": "Macao", "code": "MO"}, 
              {"name": "Macedonia", "code": "MK"}, 
              {"name": "Madagascar", "code": "MG"}, 
              {"name": "Malawi", "code": "MW"}, 
              {"name": "Malaysia", "code": "MY"}, 
              {"name": "Maldives", "code": "MV"}, 
              {"name": "Mali", "code": "ML"}, 
              {"name": "Malta", "code": "MT"}, 
              {"name": "Marshall Isl.", "code": "MH"}, 
              {"name": "Martinique", "code": "MQ"}, 
              {"name": "Mauritania", "code": "MR"}, 
              {"name": "Mauritius", "code": "MU"}, 
              {"name": "Mayotte", "code": "YT"}, 
              {"name": "Mexico", "code": "MX"}, 
              {"name": "Micronesia", "code": "FM"}, 
              {"name": "Moldova", "code": "MD"}, 
              {"name": "Monaco", "code": "MC"}, 
              {"name": "Mongolia", "code": "MN"}, 
              {"name": "Montenegro", "code": "ME"},
              {"name": "Montserrat", "code": "MS"},
              {"name": "Morocco", "code": "MA"}, 
              {"name": "Mozambique", "code": "MZ"}, 
              {"name": "Myanmar", "code": "MM"}, 
              {"name": "Namibia", "code": "NA"}, 
              {"name": "Nauru", "code": "NR"}, 
              {"name": "Nepal", "code": "NP"}, 
              {"name": "Netherlands", "code": "NL"}, 
              {"name": "Netherlands Antilles", "code": "AN"}, 
              {"name": "New Caledonia", "code": "NC"}, 
              {"name": "New Zealand", "code": "NZ"}, 
              {"name": "Nicaragua", "code": "NI"}, 
              {"name": "Niger", "code": "NE"}, 
              {"name": "Nigeria", "code": "NG"}, 
              {"name": "Niue", "code": "NU"}, 
              {"name": "Norfolk Isl.", "code": "NF"}, 
              {"name": "Northern Mariana Isl.", "code": "MP"}, 
              {"name": "Norway", "code": "NO"}, 
              {"name": "Oman", "code": "OM"}, 
              {"name": "Pakistan", "code": "PK"}, 
              {"name": "Palau", "code": "PW"}, 
              {"name": "Palestinian", "code": "PS"}, 
              {"name": "Panama", "code": "PA"}, 
              {"name": "Papua New Guinea", "code": "PG"}, 
              {"name": "Paraguay", "code": "PY"}, 
              {"name": "Peru", "code": "PE"}, 
              {"name": "Philippines", "code": "PH"}, 
              {"name": "Pitcairn", "code": "PN"}, 
              {"name": "Poland", "code": "PL"}, 
              {"name": "Portugal", "code": "PT"}, 
              {"name": "Puerto Rico", "code": "PR"}, 
              {"name": "Qatar", "code": "QA"}, 
              {"name": "Reunion", "code": "RE"}, 
              {"name": "Romania", "code": "RO"}, 
              {"name": "Russian Federation", "code": "RU"}, 
              {"name": "RWANDA", "code": "RW"}, 
              {"name": "Saint Helena", "code": "SH"}, 
              {"name": "Saint Kitts and Nevis", "code": "KN"}, 
              {"name": "Saint Lucia", "code": "LC"}, 
              {"name": "Saint Pierre and Miquelon", "code": "PM"}, 
              {"name": "Saint Vincent", "code": "VC"}, 
              {"name": "Samoa", "code": "WS"}, 
              {"name": "San Marino", "code": "SM"}, 
              {"name": "Sao Tome and Principe", "code": "ST"}, 
              {"name": "Saudi Arabia", "code": "SA"}, 
              {"name": "Senegal", "code": "SN"}, 
              {"name": "Serbia", "code": "RS"}, 
              {"name": "Seychelles", "code": "SC"}, 
              {"name": "Sierra Leone", "code": "SL"}, 
              {"name": "Singapore", "code": "SG"}, 
              {"name": "Slovakia", "code": "SK"}, 
              {"name": "Slovenia", "code": "SI"}, 
              {"name": "Solomon Isl.", "code": "SB"}, 
              {"name": "Somalia", "code": "SO"}, 
              {"name": "South Africa", "code": "ZA"}, 
              {"name": "Georgia and Sandwich Isl.", "code": "GS"}, 
              {"name": "Spain", "code": "ES"}, 
              {"name": "Sri Lanka", "code": "LK"}, 
              {"name": "Sudan", "code": "SD"}, 
              {"name": "Suriname", "code": "SR"}, 
              {"name": "Svalbard and Jan Mayen", "code": "SJ"}, 
              {"name": "Swaziland", "code": "SZ"}, 
              {"name": "Sweden", "code": "SE"}, 
              {"name": "Switzerland", "code": "CH"}, 
              {"name": "Syrian Arab Republic", "code": "SY"}, 
              {"name": "Taiwan", "code": "TW"}, 
              {"name": "Tajikistan", "code": "TJ"}, 
              {"name": "Tanzania", "code": "TZ"}, 
              {"name": "Thailand", "code": "TH"}, 
              {"name": "Timor-Leste", "code": "TL"}, 
              {"name": "Togo", "code": "TG"}, 
              {"name": "Tokelau", "code": "TK"}, 
              {"name": "Tonga", "code": "TO"}, 
              {"name": "Trinidad and Tobago", "code": "TT"}, 
              {"name": "Tunisia", "code": "TN"}, 
              {"name": "Turkey", "code": "TR"}, 
              {"name": "Turkmenistan", "code": "TM"}, 
              {"name": "Turks and Caicos Is.", "code": "TC"}, 
              {"name": "Tuvalu", "code": "TV"}, 
              {"name": "Uganda", "code": "UG"}, 
              {"name": "Ukraine", "code": "UA"}, 
              {"name": "United Arab Emirates", "code": "AE"}, 
              {"name": "United Kingdom", "code": "GB"}, 
              {"name": "United States", "code": "US"}, 
              {"name": "Minor Outlying Isl.", "code": "UM"}, 
              {"name": "Uruguay", "code": "UY"}, 
              {"name": "Uzbekistan", "code": "UZ"}, 
              {"name": "Vanuatu", "code": "VU"}, 
              {"name": "Venezuela", "code": "VE"}, 
              {"name": "Viet Nam", "code": "VN"}, 
              {"name": "Virgin Isl., British", "code": "VG"}, 
              {"name": "Wallis and Futuna", "code": "WF"}, 
              {"name": "Western Sahara", "code": "EH"}, 
              {"name": "Yemen", "code": "YE"}, 
              {"name": "Zambia", "code": "ZM"}, 
              {"name": "Zimbabwe", "code": "ZW"} 
              ]

   
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
                   
                    </TouchableOpacity>

             <TouchableOpacity  style={styles.birthdateContainer} onPress={ () => this.toggleCountryPicker()} >
            <Text  style={styles.birthdateText} 
            ref={countryRef => this.countryRef = countryRef}> {this.state.country}</Text>

             </TouchableOpacity>

  
               
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

                <Modal visible ={this.state.pickerCountry} animationType={"slide"} transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{ margin:20,
                         padding:20, 
                         backgroundColor: '#efefef',
                         
                        //  '#efefef',
                         bottom: 20,
                         left: 20,
                         right: 20,
                         height: 450,
                         position: 'absolute',
                         alignItems: 'center' ,
                         borderBottomLeftRadius: 22,
                         borderBottomRightRadius: 22,
                         borderTopLeftRadius: 22,
                         borderTopRightRadius: 22,                     
                          }}>
                          
                    <Text style={{ fontWeight: 'bold', alignItems: 'center', marginBottom:10}}>Please pick a Country </Text>
                  
                    <FlatList contentContainerStyle={styles.contentCountry}
                        data={pickerValues}
           
                        renderItem={({item}) => <TouchableOpacity key={item.name} onPress={() => this.setPickerValue(item.name)} style={{ paddingTop: 3, paddingBottom: 3}}> 
                                              <Text style={{ fontSize: 18, padding:3}} >{item.name}</Text>
                                              </TouchableOpacity >}
                      />
      
  

                    <TouchableOpacity   onPress={() => this.toggleCountryPicker()} style={{ marginTop: 5, paddingTop: 4, paddingBottom: 4}}>
                      <Text style={{ color: '#999'}}>Cancel</Text>
                    </TouchableOpacity >
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
      contentCountry:{
        // height: 330,
        width: 250,
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
