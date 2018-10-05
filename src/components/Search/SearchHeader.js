import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { getFollowingFollowers } from '../../actions';
import SearchEnterQra from './SearchEnterQra';
import { hasAPIConnection} from '../../helper';
import NoInternetModal from '../Qso/NoInternetModal';
import QraProfile from './../Qso/QraProfile';


Amplify.configure(awsconfig);

class SearchHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
         
          nointernet: false
        }
      }


//   async componentDidMount() {
//     console.log("component Did Mount Search");
 
refresh = async () => {
    if (await hasAPIConnection())
     this.props.getFollowingFollowers();
   else 
     this.setState({nointernet: true});
    }


//   }
closeNoInternetModal = () => {
    this.setState({nointernet: false}); 
   
  }

  openNoInternetModal = () => {
    this.setState({nointernet: true}); 
   
  }

 
   
        render() { console.log("RENDER SearchHeader Screen" );

        return   <View style={{flex: 1, flexDirection: 'column'}}>
            
                
            <View style={{flex: 0.7,flexDirection: 'column'}}>
              <QraProfile qra={this.props.qra} imageurl={this.props.rdsurl+'profile/profile.jpg?'+this.props.sqsoprofilepicrefresh } />  
              <SearchEnterQra openNointernetModal={this.openNoInternetModal.bind(this)}/>
            </View>

            <View style={{flex: 0.3,flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', flex:1}}>
                
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

            <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />

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
             followingsselected: state.sqso.currentQso.followingsSelected,   
             qra: state.sqso.qra,
             rdsurl: state.sqso.urlRdsS3,
             sqsoprofilepicrefresh: state.sqso.profilePicRefresh
    };
};


const mapDispatchToProps = {
    getFollowingFollowers
  
   }

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);