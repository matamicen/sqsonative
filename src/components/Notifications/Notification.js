import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, TouchableOpacity,  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { getFollowingFollowers, followersAlreadyCalled } from '../../actions';
// import FollowerList from './FollowerList';
// import SearchHeader from './SearchHeader';


Amplify.configure(awsconfig);

class Notification extends Component {
  static navigationOptions = {
      tabBarLabel: 'Notifications',  
        

      tabBarIcon: ({ tintColor }) => {
        return (<Image
            style={{ width: 28, height: 28  }}
            source={require('../../images/notifications.png')}/>);}


  }

  async componentDidMount() {
    console.log("component Did Mount Notifications");
    // if (!this.props.followersalreadycalled)
    //   {
    //           this.props.getFollowingFollowers();
    //           this.props.followersAlreadyCalled(true);
    //   }


  }

 
   
render() { console.log("RENDER qso Screen" );

return   <View style={{flex: 1}}>
       
         
       <View style={{flex: 1, marginTop: 30, marginLeft: 10}}>
          {/* <SearchHeader />  */}
          <Text style={styles.FollowingsText} >Notifications</Text>


              
       <View style={{flex: 4, width:450, marginBottom: 10}}>
       
       {/* <FollowerList />  */}
      
       </View>
      
       </View>

           </View>

} 

}

const styles = StyleSheet.create({
  FollowingsText: {
    //  textAlign: 'center',
      color: 'orange',
      fontSize: 22,
      fontWeight: '700',
       flex:0.8
             },
             otherText: {
           //   textAlign: 'center',
              color: 'grey',
              fontSize: 12,
              fontWeight: '400'
              
              
              
                     }
          })
  


 const mapStateToProps = state => {
    return {  
      followersalreadycalled: state.sqso.currentQso.followersAlreadyCalled,  
    };
};


const mapDispatchToProps = {
  getFollowingFollowers,
  followersAlreadyCalled
   }

export default connect(mapStateToProps, mapDispatchToProps)(Notification);