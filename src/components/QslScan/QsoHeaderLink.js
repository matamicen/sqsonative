import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TextInput  } from 'react-native';
import { connect } from 'react-redux';
import { fetchPeople } from '../../actions';
import QraLink from './QraLink';
import QsoQrasLink from './QsoQrasLink';
import QsoTypeLink from './QsoTypeLink';
import QsoBandLink from './QsoBandLink';
import QsoModeLink from './QsoModeLink';
import QsoDateLink from './QsoDateLink';
import QsoQtrLink from './QsoQtrLink';


class QsoHeaderLink extends Component {

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
       
             <View style={{ flex:2.6, width: 400}}>
               
                <View style={{flexDirection: 'row', flex:1}}>
                    <View style={{flex:0.18}}>
                        <QraLink qra={this.props.qra} imageurl={this.props.profilepic} />  
                      </View>
                      <View style={{flex:0.15}}>
                        <QsoTypeLink type={this.props.type}/> 
                        </View>
                      <View style={{flex:0.67}}>  
                        {  this.props.type!=='POST' ?
                        <QsoQrasLink qras={this.props.qras}/> : null} 
                      </View> 
                  </View> 

              </View>

            <View style={{flex:1.40, marginTop: 0}}>
                  
                  <View style={{flex:1, flexDirection: 'row', marginTop: 0}}>
                    <View style={{flex:0.5, height: 25}} >
                    
                      <QsoBandLink  band={this.props.band}/>
                      {/* <QsoDateLink datetime={this.props.datetime} /> */}
                    </View>
                    {/* <View style={{flex:0.5, alignItems: 'flex-end',height: 25}} > */}
                    <View style={{flex:0.5, alignItems: 'flex-start'}} >
                      <QsoDateLink datetime={this.props.datetime} />
                    </View>  
                  </View> 

                  <View style={{flex:1, flexDirection: 'row',  marginTop: 0}}>  
                        <View style={{flex:0.5,  height: 25}} > 
                            <QsoModeLink mode={this.props.mode} />
                            {/* <QsoQtrLink datetime={this.props.datetime} /> */}
                        </View>    
                        <View style={{flex:0.5, alignItems: 'flex-start', height: 25}} >            
                            <QsoQtrLink datetime={this.props.datetime} />
                        </View >
                  </View>  
             </View>     
            
            </View>
           
       
        )} 

 }

 const styles = StyleSheet.create({
   content: {
      
    marginTop: 35,
    marginLeft: 3,
    marginRight: 3,
    flex: 4
    
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

export default connect(mapStateToProps, mapDispatchToProps)(QsoHeaderLink);