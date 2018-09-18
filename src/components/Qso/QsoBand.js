import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Modal, StyleSheet, TouchableHighlight, TouchableOpacity  } from 'react-native';
import { connect } from 'react-redux';
import { setBand, postQsoNew, onprogressTrue, onprogressFalse, postQsoEdit, actindicatorPostQsoNewTrue } from '../../actions';
import PropTypes from 'prop-types';
import { updateOnProgress, check_firstTime_OnProgress, hasAPIConnection } from '../../helper';
import NoInternetModal from './NoInternetModal';



class QsoBand extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
       //   pickerSelection: 'Choose Band',
          pickerDisplayed: false,
          nointernet: false
         
       
        };
      }

      componentDidMount() {
 
    }

    
      setPickerValue = async (value) => {
     //     this.setState({pickerSelection: value});

     if (await hasAPIConnection())
     {
     if (this.props.band!==value){    
                console.log("pasa por setBand");
                await this.props.setBand(value);

                if (ONPROGRESS=updateOnProgress(this.props.qsotype,this.props.band,this.props.mode,this.props.qsoqras))
                await this.props.onprogressTrue();
           else
                 this.props.onprogressFalse();

                 if (this.props.sqlrdsid===''){
            
                    // chequeo si esta OnProgress para poder obtener el SqlRdsID de AWS RDS
                  if (ONPROGRESS) {
                   data = check_firstTime_OnProgress(this.props.qsotype,this.props.band,this.props.mode,
                                                this.props.qra,ONPROGRESS,this.props.sqlrdsid);
                        console.log("Data to Send API: "+ JSON.stringify(data));  
                       this.props.actindicatorPostQsoNewTrue();
                       this.props.postQsoNew(data,this.props.qsoqras);
                       
                  }else console.log("Todavia no esta OnProgreSSS como para llamar a PostNewQso");
                    
                  }else {
                      qsoHeader = { "mode" : this.props.mode,
                                    "band" : this.props.band,
                                    "type" : this.props.qsotype,
                                    "sqlrdsid" : this.props.sqlrdsid
                                  }
                                  console.log("antes de enviar a API qdoHeader:"+ JSON.stringify(qsoHeader))

                         await this.props.postQsoEdit(qsoHeader);         

                       }  

            }
          this.togglePicker();
        }else
        { this.togglePicker();
          this.setState({nointernet: true});
        }
        
      }

      closeNoInternetModal = () => {
        this.setState({nointernet: false}); 
        // this.togglePicker();
      }


      togglePicker = () => {
          console.log("llamo togglepicker")
        this.setState({pickerDisplayed: !this.state.pickerDisplayed})
    }


    render() { console.log("RENDER qso BAND" );
              
               const pickerValues = [
                   {
                       title: '70cm',
                       value: '70cm'
                   },
                   {
                    title: '1.25m',
                    value: '1.25m'
                },
                {
                    title: '2m',
                    value: '2m'
                },
                {
                    title: '6m',
                    value: '6m'
                },
                {
                    title: '10m',
                    value: '10m'
                },
                {
                    title: '15m',
                    value: '15m'
                },
                {
                    title: '17m',
                    value: '17m'
                },
                {
                    title: '20m',
                    value: '20m'
                },
                {
                    title: '40m',
                    value: '40m'
                },
                {
                    title: '60m',
                    value: '60m'
                },
                {
                    title: '80m',
                    value: '80m'
                },
                {
                    title: '160m',
                    value: '160m'
                }
               ]
              


        return <View>               
                                 

               <Text style={{ fontSize: 18, color: '#999', marginTop: 13, marginLeft: 33}} onPress={() => this.togglePicker()} >{this.props.band}</Text>
             
               <Modal visible ={this.state.pickerDisplayed} animationType={"slide"} transparent={true} onRequestClose={() => console.log('Close was requested')}>
                    <View style={{ margin:20,
                         padding:20, 
                         backgroundColor: '#efefef',
                         bottom: 20,
                         left: 20,
                         right: 20,
                         position: 'absolute',
                         alignItems: 'center'                      
                          }}>
                          
                    <Text style={{ fontWeight: 'bold', alignItems: 'center', marginBottom:10}}>Please pick a Band </Text>
                    {pickerValues.map((value, index) => {
                        return  <TouchableOpacity key={index} onPress={() => this.setPickerValue(value.title)} style={{ paddingTop: 4, paddingBottom: 4 }}>
                                 <Text style={{ fontSize: 18, padding:3}} >{value.title}</Text>
                                 </TouchableOpacity >
                    })}

                    <TouchableOpacity   onPress={() => this.togglePicker()} style={{ paddingTop: 4, paddingBottom: 4}}>
                      <Text style={{ color: '#999'}}>Cancel</Text>
                    </TouchableOpacity >
                    </View>

               
               </Modal>

               <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />
             
          

            </View>
       
     } 

 }

 QsoBand.propTypes = {
   
};


 const mapStateToProps = state => {
    return {        
        band: state.sqso.currentQso.band,
        mode: state.sqso.currentQso.mode,
        qsotype: state.sqso.currentQso.qsotype,
        qsoqras: state.sqso.currentQso.qsoqras,
        sqlrdsid: state.sqso.currentQso.sqlrdsId,
        isfetching: state.sqso.isfetching,
        qra: state.sqso.qra,   
    };
};


const mapDispatchToProps = {
    setBand,
    postQsoNew,
    onprogressTrue,
    onprogressFalse,
    postQsoEdit,
    actindicatorPostQsoNewTrue
    
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoBand);

