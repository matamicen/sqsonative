import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TextInput  } from 'react-native';
import { connect } from 'react-redux';
import { fetchPeople } from '../../actions';
import Qra from './Qra';
import QsoQras from './QsoQras';
import QsoType from './QsoType';
import QsoBand from './QsoBand';
import QsoMode from './QsoMode';
import QsoDate from './QsoDate';
import QsoQtr from './QsoQtr';


class QsoHeader extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true,
          text: ''
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
                  <Qra qra={this.props.sqsoqslscan.qra} imageurl={this.props.sqsoqslscan.profilepic} />  
                 
                  <QsoType /> 
                  {  this.props.sqsoqslscan.type!=='POST' ?
                   <QsoQras /> : null} 
 
              </View> 

              <View style={{flex:1, flexDirection: 'row', marginTop: 8}}>
                <View style={{flex:0.5, height: 25}} >
                  <QsoBand /> 
                </View>
                <View style={{flex:0.5, alignItems: 'flex-end',height: 25}} >
                  <QsoDate />
                </View>  
              </View> 

              <View style={{flex:1, flexDirection: 'row',  marginTop: 25}}>  
                    <View style={{flex:0.5,  height: 25}} > 
                        <QsoMode />
                    </View>    
                    <View style={{flex:0.5, alignItems: 'flex-end', height: 25}} >            
                        <QsoQtr />
                    </View >
              </View>       
            
            </View>
           
       
        )} 

 }

 const styles = StyleSheet.create({
   content: {
      
    marginTop: 35,
    marginLeft: 3,
    marginRight: 3
    
    //flexDirection: 'row'
   
    }
});


 const mapStateToProps = state => {
    return {  
       
        sqsoqslscan: state.sqso.currentQso.qslscan.body.message
     };
};


const mapDispatchToProps = {
   
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoHeader);