import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TextInput  } from 'react-native';
import { connect } from 'react-redux';
import { fetchPeople } from '../../actions';
//import Qra from './Qra';
import QraProfile from './QraProfile';
import QsoQras from './QsoQras';
import QsoType from './QsoType';
import QsoBand from './QsoBand';
import QsoMode from './QsoMode';
import QsoEnterQra from './QsoEnterQra';


class QsoHeader extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true,
          text: '',
   
        };
      }

 
    

   componentDidMount() {
    
      //  this.props.fetchPeople();
     
       }

       LlamoAPI = () => {
      //  this.props.fetchPeople();
        //this.props.navigation.navigate('CameraScreen');
      }

  


    render() { console.log("RENDER qso Header");
           
                           
              
        return(  <View style={styles.content} >
               
               <View style={{flexDirection: 'row'}}>
                  <QraProfile qra={this.props.qra} imageurl={this.props.rdsurl+'profile/profile.jpg?'+this.props.sqsoprofilepicrefresh } />  
            
                  { this.props.sqsonewqsoactive ?
                  <QsoType /> : null }
                  { this.props.sqsonewqsoactive && this.props.qsotype!=='POST' ?
                   <QsoQras /> : null} 
 
              </View> 
              <View style={{flexDirection: 'row', marginTop: 6}}>
              { this.props.sqsonewqsoactive && this.props.qsotype!=='POST' ?
                  <QsoEnterQra /> : null }
              { this.props.sqsonewqsoactive && this.props.qsotype!=='POST' ?    
                  <QsoBand /> : null }
              { this.props.sqsonewqsoactive && this.props.qsotype!=='POST' ?    
                  <QsoMode />  : null }
              </View>           
            
            </View>
           
       
        )} 

 }

 const styles = StyleSheet.create({
   content: {
      
    marginTop: 30,
    marginLeft: 3,
    marginRight: 3
    
    //flexDirection: 'row'
   
    },
    faceImageStyle: {
        width: 65,
        height: 65,
        borderRadius: 30
         }
});


 const mapStateToProps = state => {
    return {  sqsonewqsoactive: state.sqso.newqsoactive,
        qsotype: state.sqso.currentQso.qsotype,
        qra: state.sqso.qra,
        sqsoprofilepicrefresh: state.sqso.profilePicRefresh,
        rdsurl: state.sqso.urlRdsS3
       
     };
};


const mapDispatchToProps = {
   
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoHeader);