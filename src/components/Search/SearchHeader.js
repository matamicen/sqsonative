import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { getFollowingFollowers } from '../../actions';
import SearchEnterQra from './SearchEnterQra';


Amplify.configure(awsconfig);

class SearchHeader extends Component {


//   async componentDidMount() {
//     console.log("component Did Mount Search");
 
refresh = () => {
    this.props.getFollowingFollowers();

    }


//   }

 
   
        render() { console.log("RENDER SearchHeader Screen" );

        return   <View style={{flex: 1}}>
            
                
            <View style={{flex: 0.5}}>
              <SearchEnterQra />
            </View>

            <View style={{flex: 0.5}}>
              <View style={{flexDirection: 'row', marginTop:10, flex:1}}>
                
                <View style={{flex: 0.5}}>
                    {(this.props.followingsselected) ?
                        // <TouchableOpacity  >
                            <Text style={styles.FollowingsText} >Followings</Text>
                        // </TouchableOpacity>
                    :
                    // <TouchableOpacity  style={{ flex:0.8}}  >
                       <Text style={styles.FollowingsText} >Followers</Text>
                    // </TouchableOpacity>

                    }
                       
               </View>        
               {/* style={{ flex:0.2}} */}
               <View style={{flex: 0.5, alignItems: 'flex-end', marginRight: 10 }}>
                <TouchableOpacity   onPress={ () => this.refresh()} >
                        <Image source={require('../../images/reload.png')}  style={{width: 18, height: 18, marginTop: 3, marginLeft: 15 } } 
                        resizeMode="contain" />  
                            <Text style={styles.otherText} >Refresh</Text>
                        </TouchableOpacity>
               </View>
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
             followings: state.sqso.currentQso.followings,
             followers: state.sqso.currentQso.followers,
             followingsselected: state.sqso.currentQso.followingsSelected   
    };
};


const mapDispatchToProps = {
    getFollowingFollowers
  
   }

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);