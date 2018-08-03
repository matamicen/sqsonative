import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Modal, StyleSheet, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { setBand, postQsoNew, onprogressTrue, onprogressFalse, postQsoEdit, actindicatorPostQsoNewTrue } from '../../actions';
import PropTypes from 'prop-types';
import { updateOnProgress, check_firstTime_OnProgress} from '../../helper';


class QsoBand extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
       //   pickerSelection: 'Choose Band',
          pickerDisplayed: false
         
       
        };
      }

      componentDidMount() {
 
    }

   
    render() { console.log("RENDER qso BAND" );
              
              


        return <View>               
                                 
            {(this.props.sqsoqslscanerror===0) &&
               <Text style={{ fontSize: 18, color: '#999', marginLeft: 5}}  >Band:
                 <Text style={{ fontSize: 18, color: 'orange'}}> {this.props.sqsoqslscan.band} </Text>
              </Text>
            } 
             
              
          

            </View>
       
     } 

 }

 QsoBand.propTypes = {
   
};


 const mapStateToProps = state => {
    return {      
        sqsoqslscanerror: state.sqso.currentQso.qslscan.body.error,  
        sqsoqslscan: state.sqso.currentQso.qslscan.body.message
    };
};


const mapDispatchToProps = {
   
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoBand);

