import React, { Component } from 'react';
import { Text, Image, View, Modal, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { QsoQraDelete, deleteQsoQra, followAdd, unfollow, getFollowingFollowers } from '../../actions';
import { getDate, getFollowStatus} from '../../helper';
import PropTypes from 'prop-types';



class QraProfile extends Component {

    constructor(props) {
        super(props);
        this.empty = "require('../../images/emptyprofile.png')"
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true,
          modaldeleteqra: false,
          followstatus: 'empty',
          imageLoading: true,
        };
      }

       
      componentWillReceiveProps(nextProps) {
    
       
        console.log("El valor de profileurlcondition: " + nextProps.profileurlcondition);
       
    
        this.setState({
            imageLoading: nextProps.profileurlcondition    
        });
    }
  

   componentDidMount() {
    
      //  this.props.fetchPeople();
    
       }

       LlamoAPI = () => {
      //  this.props.fetchPeople();
        //this.props.navigation.navigate('CameraScreen');
      }

      onPressItem = async (url, qra) => {
        console.log('click QRA: '+ url + ' ' + qra);
        if (this.props.following==='NOT_EXIST' && this.props.sqlrdsid.length===0)
           this.setState({ modaldeleteqra: true, followstatus: 'NOT_EXIST' });
         else{
        followstat = await getFollowStatus(this.props.followings, qra);
        this.setState({ modaldeleteqra: true, followstatus: followstat });
         }
        }
        
        closeModaldeleteqra = () => {
          console.log('click close QRA: ');
          this.setState({ modaldeleteqra: false});
          }

         follow = async (qra) => {
         //  if(!this.props.isfetching){
              date = getDate();
              if (this.state.followstatus==="false")
               {
                 await this.props.followAdd(qra,date);
                 // chequeo si la api fue exitosa y lo dio de alta en redux
                 followstat = await getFollowStatus(this.props.followings, qra);
                 if (followstat==="true") this.setState({followstatus: 'true'})
              }
               else
               {
              await this.props.unfollow(qra);
              followstat = await getFollowStatus(this.props.followings, qra);
              if (followstat==="false") this.setState({followstatus: 'false'})
            }

         //      this.props.getFollowingFollowers();
        //     }else console.log('intento llamar dos veces follow')
            }

            delete = (qra) => {
            // depende si el QSO esta Onprogress o si tiene un sqlrdsid creado borra llamando a la API o no.
            if (this.props.sqlrdsid !== '')
                 this.props.QsoQraDelete(this.props.sqlrdsid,qra);
               else
                 this.props.deleteQsoQra(qra);
         
             this.closeModaldeleteqra();
              }

        
            
              ImageLoading_Error = () => {
               
                this.setState({ imageLoading: false });
               
            }

    render() { console.log("RENDER QRA Profile");
               console.log('imageUrl: '+this.props.imageurl);
               console.log('imageLoading State: '+this.state.imageLoading);
       
  
              
        return( <View >

        

   {this.state.imageLoading ?
                <TouchableOpacity onPress={() => this.onPressItem(this.props.imageurl, this.props.qra)} >
                     <Image style={styles.faceImageStyle}     
                        source={{ uri: this.props.imageurl }}
                        onError={() => this.ImageLoading_Error()}  
                         />
                </TouchableOpacity>
             : 
               <TouchableOpacity  onPress={() => this.onPressItem(this.props.imageurl, this.props.qra)} 
                underlayColor="white">
                    <Image source={require('../../images/emptyprofile.png')} style={styles.faceImageStyle}/> 
               </TouchableOpacity> 
            } 
               
      
         

             <Text style={styles.name} >
                 {this.props.qra}
             </Text>


             <Modal visible={this.state.modaldeleteqra} position= {'top'} transparent={true} animationType={"slide"} onRequestClose={() => console.log('Close was requested')}>
             {/* <KeyboardAvoidingView behavior="padding"  > */}
              <View style={{ 
                   padding:10, 
                  backgroundColor : 'rgba(0,0,0,0.85)',
                   marginTop: 185,
                   left: 105,
                   right: 15,
                   width: 170,
                   height: 190,
                   paddingVertical: 5,
                 //   position: 'absolute',
                   
                 //  alignItems: 'center',
                   borderRadius: 12                       
                    }}>

                       <View style={{ marginTop: 10, flexDirection: 'row', padding:0}}>
                   
                          {/* <Qra qra={this.props.qra} imageurl={this.props.imageurl} /> */}
                          {this.props.imageurl!==null ? 

                                <Image style={styles.faceImageStyle} source={{ uri: this.props.imageurl }}/> 
                                :
                                <Image source={require('../../images/emptyprofile.png')} style={styles.faceImageStyle}/> 
                               
                          }

                          <TouchableOpacity  style={{ marginTop: 5,  padding:5, marginLeft: 5}} onPress={() => this.delete(this.props.qra)} >
                                <Image source={require('../../images/removecircle.png')}  style={{width: 24, height: 24, marginLeft:10 } } 
                                   resizeMode="contain" />  
                                    <Text style={{ color: 'grey',  fontSize: 16}}>Delete</Text>
                             
                          </TouchableOpacity>
                    
                       </View>

                          <Text style={styles.name2} >
                                  {this.props.qra}
                          </Text>
                       

                    
                     {/* <View style={{ marginTop: 1}}> */}
                      
                      {/* {this.props.following==="FALSE" && */}
                     {this.state.followstatus==="false" &&

                     <TouchableOpacity style={{ marginTop: 4}} onPress={() => this.follow(this.props.qra)} >
                       <Text style={{ color: 'grey', fontSize: 17}}>Follow {this.props.qra} </Text>
                      </TouchableOpacity>
                        
                         
                       }

                       {/* {this.props.following==="TRUE" &&  */}
                       {this.state.followstatus==="true" &&

                        <TouchableOpacity style={{ marginTop: 4}} onPress={() => this.follow(this.props.qra)} >
                          <Text style={{ color: 'grey', fontSize: 17}}>UnFollow {this.props.qra} </Text>
                        </TouchableOpacity>
                      
                         
                        
                        } 
                         
                    

                        <TouchableOpacity  style={{ marginTop: 13,  padding:5, marginLeft: 5}} onPress={() => this.closeModaldeleteqra()} >
                       <Text style={{ color: 'white', fontSize: 16}}>Cancel</Text>
                         </TouchableOpacity>

                        
                      
                    {/* </View> */}

                        

                    </View>
                {/* </KeyboardAvoidingView > */}
                   
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

  QraProfile.propTypes = {
    imageurl: PropTypes.string,
    qra: PropTypes.string
  };



 const mapStateToProps = state => {
    return { sqlrdsid: state.sqso.currentQso.sqlrdsId,
             followings: state.sqso.currentQso.followings,
             profileurlcondition: state.sqso.profileUrlCondition
    }
          //   isfetching: state.sqso.isFetching };
};


const mapDispatchToProps = {
  QsoQraDelete,
  deleteQsoQra,
  followAdd,
  unfollow,
  getFollowingFollowers
   }

export default connect(mapStateToProps, mapDispatchToProps)(QraProfile);