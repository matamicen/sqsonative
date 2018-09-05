import React from 'react';
import { addNavigationHelpers, TabNavigator, DrawerNavigator, StackNavigator } from 'react-navigation';
import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';
import QsoScreen from './Qso/QsoScreen';
import SearchScreen from './Search/Search';
import Notifications from './Notifications/Notification';
import CameraScreen from './Qso/Camera';
import QslScanScreen from './QslScan/QslScanScreen';
//import SignOutScreen from './SignOutScreen';
import ProfileScreen from './Profile/InitialScreen';
import Login from './Profile/Login';
import SignUpScreen from './Profile/SignUpForm';
import ForgotScreen from './Profile/ForgotPassword';
import QslScanQR from './QslScan/QslScanQR';



//import MainPage from './MainPage';
//import ChooseColorPage from './ChooseColorPage';


// for react-navigation 1.0.0-beta.30
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';

  
  
  const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
  );
  const addListener = createReduxBoundAddListener("root");
  // end for react-navigation 1.0.0-beta.30
  /*
    export const AppNavigator = StackNavigator({
    Main: { screen: MainPage, },
    ChooseColor: { 
        screen: ChooseColorPage, 
        navigationOptions: {
            headerLeft: null,
        } 
    }
}, {
    initialRouteName: 'Main',
    mode: 'modal'
});
  */
 
  /*
 export const AppNavigator = TabNavigator({
 Main: { screen: MainPage, },
 Tab2: { screen: ChooseColorPage,
    navigationOptions: {
        headerLeft: null,
    }  },
 /*Tab3: { screen: CameraScreen, },
 Tab4: { screen: QslScanScreen, } ,
 Tab5: { screen: SignOutScreen, } 
 
    
 }, {
    initialRouteName: 'Main',
    mode: 'modal'
});
*/
 const AppNavigator2 = TabNavigator({
    QsoScreen: { screen: QsoScreen, },
    Search: { screen: SearchScreen, },
    //   tabBarOptions: { 

    //     showIcon: true,
      
      
        
    //       //  navigationOptions: 

    //         // ({ tintColor }) => {
    //         //   return (<Image
    //         //       style={{ width: 25, height: 25 }}
    //         //       source={require('../images/removecircle.png')}/>);}

    //     //     tabBarIcon: (
    //     //       <Image style={{ width: 50, height: 50 }} source={require('../images/removecircle.png')}/>
    //     // )
    //         // }
    //  }},
    // CameraScreen: { screen: CameraScreen, },
    Notifications: { screen: Notifications, },
    QslScanScreen: { screen: QslScanScreen, },  
    ProfileScreen: { screen: ProfileScreen, },
   
}, {
  initialRouteName: 'QsoScreen',
  tabBarPosition: 'bottom',
  swipeEnabled: true, // fixes a bug in react navigation
    lazy: false, // fixes a bug in react navigation
 

  tabBarOptions: {
     labelStyle: {
         fontSize: 10,
         width: 90,
         padding: 0,   
     },
     style: {
      backgroundColor: 'white'
  },
  inactiveTintColor: 'black',
  activeTintColor : 'black',
     showIcon: true,
     iconStyle: {
      width: 31,
      height: 31
  },
  tabStyle: {
    height: 75
},

  }
    
});

export const AppNavigator = StackNavigator({
    Root: {
      screen: Login,
      navigationOptions: {
        header: null        
      },    
    },
    
    CameraScreen2: {
      screen: CameraScreen,
      navigationOptions: {
        header: null

      },
        
      },

      // Login: {
      //   screen: Login,
      //   navigationOptions: {
      //     header: null
  
      //   },
          
      //  },
     AppNavigator2: {
        screen: AppNavigator2,
        navigationOptions: {
          header: null
  
        },
          
       },

       QslScanQR: {
        screen: QslScanQR,
        navigationOptions: {
          header: null
  
        },
          
        },


       SignUpScreen: {
        screen: SignUpScreen,
        navigationOptions: {
          header: null
  
        },
          
        },

               SignUpScreen: {
        screen: SignUpScreen,
        navigationOptions: {
          header: null
  
        },
          
        },

        ForgotScreen: {
          screen: ForgotScreen,
          navigationOptions: {
            header: null
    
          },
            
          },


    
   
   initialRouteName: 'Login'
   
    
  });



const AppWithNavigationState2 = ({ dispatch, nav }) => (
  
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener })} />
);

const mapStateToProps = state => ({
    nav: state.nav,
});


  
export default connect(mapStateToProps)(AppWithNavigationState2);