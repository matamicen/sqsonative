import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity  } from 'react-native';
import { connect } from 'react-redux';
import { followAdd, unfollow, refreshFollowings } from '../../actions';
import PropTypes from 'prop-types';
import { getDate} from '../../helper';


class User extends Component {

    constructor(props) {
        super(props);
        
       
      }

  

   componentDidMount() {
    
      //  this.props.fetchPeople();
     
       }

       LlamoAPI = () => {
      //  this.props.fetchPeople();
        //this.props.navigation.navigate('CameraScreen');
      }

    //   onPressItem = (fileName2, description, fileaux, sqlrdsid, size, type, rdsUrlS3, date) => {
    //    console.log('presiono:' + fileName2+ ' ' + description + ' ' + fileaux + ' ' + sqlrdsid + ' ' + size + ' ' + type + ' '+rdsUrlS3) ;
    //    this.props.uploadMediaToS3(fileName2, fileaux, sqlrdsid, description, size, type, rdsUrlS3, date);
    // }
    follow = async (qra,follow) => {
           
      date = getDate();
      if (follow==="FALSE")
        await this.props.followAdd(qra,date);
       else
        await this.props.unfollow(qra); 
       this.props.refreshFollowings(true);

    }

    render() { console.log("RENDER USER FOLLOWERS");
  
           
                           
              
        return( <View >
               
               <View style={{ marginTop: 6}}>
               <View style={{flexDirection: 'row'}}>  
               { (this.props.imageurl===null) ?
                  
                  <Image source={require('../../images/emptyprofile.png')} style={styles.faceImageStyle}/> 
                  :

                     <Image
                    style={styles.faceImageStyle}
                    source={{ uri: this.props.imageurl }}
                      />
                    }

                     {this.props.following==="FALSE" &&
                     

                     <TouchableOpacity style={{ marginTop: 15, marginLeft: 20}} onPress={() => this.follow(this.props.name,this.props.following)} >
                       <Text style={{ color: 'white', fontSize: 17}}>Follow  </Text>
                      </TouchableOpacity>
                        
                         
                       }

                       {this.props.following==="TRUE" && 
                      

                        <TouchableOpacity style={{ marginTop: 15, marginLeft: 20 }} onPress={() => this.follow(this.props.name,this.props.following)} >
                          <Text style={{ color: 'white', fontSize: 17}}>UnFollow </Text>
                        </TouchableOpacity>
                      
                         
                        
                        } 
                        </View>
                      
                      <Text style={styles.name2} >
                                  {this.props.name}
                          </Text>
                        
                         {/* {this.props.idqra_followed} */}
                

                    <View  style={{marginLeft: 25 }}>

                      {/* <Progress.Bar
                          style={{marginTop: 27, height: 6, width: 230 }}
                          width={230}
                          unfilledColor="lightgrey"
                          borderRadius={0}
           
                          color="lightgreen"
                          borderWidth={0}
                          progress={this.props.progress}
                       
                        /> */}

                        
                        
              

                    </View>

              </View>

         

         </View>
            
           
       
        )} 

 }

 
const styles = StyleSheet.create({
       faceImageStyle: {
      width: 65,
      height: 65,
      borderRadius: 30
       },
    name:{
        fontSize: 12,
        marginLeft: 5,
        padding: 2,
        fontWeight: 'bold',        
        color: 'orange'        
    },
    name2:{
        fontSize: 12,
        marginLeft: 11,
        padding: 2,
        fontWeight: 'bold',        
        color: 'orange'        
    },
    status:{
      fontSize: 16,
      marginTop: 2,
      textAlign: 'right',
     // padding: 2,
     // fontWeight: 'bold',        
      color: 'grey'        
  }
  });

  User.propTypes = {
    imageurl: PropTypes.string,
    qra: PropTypes.string
  };



 const mapStateToProps = state => {
    return {  };
};


const mapDispatchToProps = {
  followAdd,
   unfollow,
   refreshFollowings
   }

export default connect(mapStateToProps, mapDispatchToProps)(User);