import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { getFollowingFollowers, followersAlreadyCalled } from '../../actions';
import FollowerList from './FollowerList';
import SearchHeader from './SearchHeader';


Amplify.configure(awsconfig);

class Search extends Component {
  static navigationOptions = {
      tabBarLabel: 'Search'

  }

  async componentDidMount() {
    console.log("component Did Mount Search");
    if (!this.props.followersalreadycalled)
      {
              this.props.getFollowingFollowers();
              this.props.followersAlreadyCalled(true);
      }


  }

 
   
render() { console.log("RENDER qso Screen" );

return   <View style={{flex: 1}}>
       
         
       <View style={{flex: 1, marginTop: 30, marginLeft: 10}}>
          <SearchHeader /> 


              
       <View style={{flex: 4, width:450, marginBottom: 10}}>
       
       <FollowerList /> 
      
       </View>
      
       </View>

           </View>

} 

}


 const mapStateToProps = state => {
    return {  
      followersalreadycalled: state.sqso.currentQso.followersAlreadyCalled,  
    };
};


const mapDispatchToProps = {
  getFollowingFollowers,
  followersAlreadyCalled
   }

export default connect(mapStateToProps, mapDispatchToProps)(Search);