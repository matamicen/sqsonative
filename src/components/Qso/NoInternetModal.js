import React, { Component } from 'react';
import { Text, Image, View, Modal, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';




class NoInternetModal extends Component {

    constructor(props) {
        super(props);
        this.empty = "require('../../images/emptyprofile.png')"
        
        this.state = {
    
            nointernet: false
        };
      }

      componentWillReceiveProps(nextProps) {
    
       
        // console.log("El valor de profileurlcondition: " + nextProps.profileurlcondition);
       
    
        this.setState({
            nointernet: nextProps.nointernet    
        });
    }

       
      

   componentDidMount() {
    
  
    
       }


            
            //   ImageLoading_Error = () => {
               
            //     this.setState({ imageLoading: false });
               
            // }

    render() { console.log("RENDER no Internet Modal");
              
  
              
        return( <View >

        
  <Modal visible ={this.state.nointernet}  transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{
                      //  margin:20,
                          padding:20, 
                          backgroundColor:  '#475788',
                          top: 90,
                          left: 30,
                          right: 30,
                          position: 'absolute',
                                                    
                        //  alignItems: 'center'                      
                          }}>
          

                    <View style={{flex: 1, alignItems: 'center'}}>

                    <Image source={require('../../images/noInternet.png')}  style={{width: 60, height: 60 } } 
                      resizeMode="contain" /> 

                     <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 10 }}>There is no Internet connection.</Text>

                    <TouchableOpacity  onPress={() =>  this.props.closeInternetModal() } style={{ paddingTop: 8, paddingBottom: 4, flex: 0.5}}>
                      <Text style={{ color: '#999', fontSize: 22}}>OK</Text>
                    </TouchableOpacity>
                    
                    </View>
                    
                    </View>

               
               </Modal>


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

 



 const mapStateToProps = state => {
    return { 
             
    }
         
};


const mapDispatchToProps = {
 
   }

export default connect(mapStateToProps, mapDispatchToProps)(NoInternetModal);