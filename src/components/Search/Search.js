import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, TouchableOpacity, Platform, Dimensions } from 'react-native';
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
      tabBarLabel: 'Search',  
        

      tabBarIcon: ({ tintColor }) => {
        return (<Image
            style={{ width: 28, height: 28  }}
            source={require('../../images/search.png')}/>);}


  }

  constructor(props) {
    super(props);

      this.width = Dimensions.get('window').width; //full width
      this.height = Dimensions.get('window').height; //full height
          
   
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
       
         
       <View style={{flex: 0.35, marginTop: Platform.OS === 'ios' ? 13 : 13, marginLeft: 6}}>
          <SearchHeader /> 


       </View>        
       <View style={{flex: 0.65, width:this.width-15, marginBottom: 10}}>
       
       <FollowerList /> 
      
       </View>
      
       {/* </View> */}

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