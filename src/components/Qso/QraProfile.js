import React, { Component } from 'react';
import { Text, Image, View, Modal, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';



class QraProfile extends Component {

    constructor(props) {
        super(props);
        this.empty = "require('../../images/emptyprofile.png')"
        
        this.state = {
    
          imageLoading: true
        };
      }

       
      componentWillReceiveProps(nextProps) {
    
       
        console.log("El valor de profileurlcondition: " + nextProps.profileurlcondition);
       
    
        this.setState({
            imageLoading: nextProps.profileurlcondition    
        });
    }
  

   componentDidMount() {
    
  
    
       }


            
              ImageLoading_Error = () => {
               
                this.setState({ imageLoading: false });
               
            }

    render() { console.log("RENDER QRA Profile");
               console.log('imageUrl: '+this.props.imageurl);
               console.log('imageLoading State: '+this.state.imageLoading);
       
  
              
        return( <View >

        

            {this.state.imageLoading ?
               
                     <Image style={styles.faceImageStyle}     
                        source={{ uri: this.props.imageurl }}
                        onError={() => this.ImageLoading_Error()}  
                         />
                  : 
                    <Image source={require('../../images/emptyprofile.png')} style={styles.faceImageStyle}/> 
            } 
   
             <Text style={styles.name} >
                 {this.props.qra}
             </Text>

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
  }
  });

  QraProfile.propTypes = {
    imageurl: PropTypes.string,
    qra: PropTypes.string
  };



 const mapStateToProps = state => {
    return { 
             profileurlcondition: state.sqso.profileUrlCondition
    }
         
};


const mapDispatchToProps = {
 
   }

export default connect(mapStateToProps, mapDispatchToProps)(QraProfile);