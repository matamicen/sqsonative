import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity  } from 'react-native';
import { connect } from 'react-redux';
import { uploadMediaToS3 } from '../../actions';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

class Media extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true
        };
      }

  

   componentDidMount() {
    
      //  this.props.fetchPeople();
     
       }

       LlamoAPI = () => {
      //  this.props.fetchPeople();
        //this.props.navigation.navigate('CameraScreen');
      }

      onPressItem = (fileName2, description, fileaux, sqlrdsid, size, type, rdsUrlS3, date) => {
       console.log('presiono:' + fileName2+ ' ' + description + ' ' + fileaux + ' ' + sqlrdsid + ' ' + size + ' ' + type + ' '+rdsUrlS3) ;
       this.props.uploadMediaToS3(fileName2, fileaux, sqlrdsid, description, size, type, rdsUrlS3, date);
    }


    render() { console.log("RENDER MEDIA");
    console.log("imagen type:" + this.props.url + this.props.type)
           
                           
              
        return( <View >
               
               <View style={{flexDirection: 'row', marginTop: 6}}>

                      { (this.props.type==='image') ? <Image
                    style={styles.faceImageStyle}
                    source={{ uri: this.props.imageurl }}
                      />
                      
                      
                      : <Image
                      style={styles.faceImageStyle}
                      source={require('../../images/audio.png')}
                          /> }
                    
                      {/* <Image
                    style={styles.faceImageStyle}
                    source={{ uri: this.props.imageurl }}
                  />
                  */}

                    <View  style={{marginLeft: 25 }}>

                      <Progress.Bar
                          style={{marginTop: 27, height: 6, width: 230 }}
                          width={230}
                          unfilledColor="lightgrey"
                          borderRadius={0}
                      //   height={15}
                      //    color={['#F44336', '#2196F3', '#009688']}
                          color="lightgreen"
                          borderWidth={0}
                          progress={this.props.progress}
                          //indeterminate={true}
                        />

                            { (this.props.status==='sent') && 
                         <Text style={styles.status} > SENT </Text>
                        }
                       
                        { (this.props.status==='inprogress') && 
                         <Text style={styles.status} > IN PROGRESS </Text>
                         }

                          { (this.props.status==='failed') && 
                         <Text style={styles.status} > FAILED </Text>
                        }

                        {/* { (this.props.sent) ? 
                        // <TouchableHighlight onPress={() => this.onPressItem(this.props.name,this.props.description,this.props.imageurl,
                        //      this.props.sqlrdsid, this.props.size, this.props.type)} underlayColor="white">
                         <Text style={styles.status} > TRUE </Text>
                        //  </TouchableHighlight>
                         : */}

                         { (this.props.status==='failed') && 
                            <TouchableOpacity onPress={() => this.onPressItem(this.props.name,this.props.description,this.props.imageurl,
                                this.props.sqlrdsid, this.props.size, this.props.type, this.props.rdsUrlS3, this.props.date)} underlayColor="white">
                            <Text style={styles.status} > Send again </Text>
                            </TouchableOpacity>
                         }
                              
                        
              

                    </View>

              </View>

             {/* <Text style={styles.name} >
                 {this.props.name}
             </Text> 
             <Text style={styles.name} >
                 {this.props.size}
             </Text> */}

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
    status:{
      fontSize: 16,
      marginTop: 2,
      textAlign: 'right',
     // padding: 2,
     // fontWeight: 'bold',        
      color: 'grey'        
  }
  });

  Media.propTypes = {
    imageurl: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  };



 const mapStateToProps = state => {
    return {  };
};


const mapDispatchToProps = {
    uploadMediaToS3
   }

export default connect(mapStateToProps, mapDispatchToProps)(Media);