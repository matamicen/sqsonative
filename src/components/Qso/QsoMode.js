import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Modal, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { setMode, postQsoNew, onprogressTrue, onprogressFalse, postQsoEdit, actindicatorPostQsoNewTrue } from '../../actions';
import PropTypes from 'prop-types';
import { updateOnProgress, check_firstTime_OnProgress, hasAPIConnection} from '../../helper';
import NoInternetModal from './NoInternetModal';

class QsoMode extends Component {

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
     if (this.props.mode!==value){ 
         await this.props.setMode(value);

          if (ONPROGRESS=updateOnProgress(this.props.qsotype,this.props.band,this.props.mode,this.props.qsoqras))
          await this.props.onprogressTrue();
     else
           this.props.onprogressFalse();

           if (this.props.sqlrdsid===''){
      
              // chequeo si esta OnProgress para poder obtener el SqlRdsID de AWS RDS
            if (ONPROGRESS) {
             data = check_firstTime_OnProgress(this.props.qsotype,this.props.band,this.props.mode,
                                          this.props.qra,ONPROGRESS,this.props.sqlrdsid, this.props.latitude,
                                          this.props.longitude);
                  console.log("Data to Send API: "+ JSON.stringify(data)); 
                  
                  this.props.actindicatorPostQsoNewTrue();
                  this.props.postQsoNew(data,this.props.qsoqras);
                 
            }else console.log("Todavia no esta OnProgreSSS como para llamar a PostNewQso");
              
            }
            else
             {
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
             } else
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


    render() { console.log("RENDER qso MODE" );
              
               const pickerValues = [
                   {
                       title: 'SSB',
                       value: 'SSB'
                   },
                   {
                    title: 'AM',
                    value: 'AM'
                },
                {
                    title: 'FM',
                    value: 'FM'
                },
                {
                    title: 'CW',
                    value: 'CW'
                },
                {
                    title: 'JT8',
                    value: 'JT8'
                },
                {
                    title: 'JT65',
                    value: 'JT65'
                },
                {
                    title: 'PSK31',
                    value: 'PSK31'
                },
                {
                    title: 'RTTY',
                    value: 'RTTY'
                },
                {
                    title: 'DStar',
                    value: 'DSTAR'
                },
                {
                    title: 'DMR',
                    value: 'DMR'
                },
                {
                    title: 'C4FM',
                    value: 'C4FM'
                }
               ]
              


        return <View >               
                                 

               <Text style={{ fontSize: 18, color: '#999', marginTop: 13, marginLeft: 48}} onPress={() => this.togglePicker()} >{this.props.mode}</Text>
             
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
                          
                    <Text style={{ fontWeight: 'bold', alignItems: 'center', marginBottom:10}}>Please pick a Mode </Text>
                    {pickerValues.map((value, index) => {
                        return  <TouchableOpacity key={index} onPress={() => this.setPickerValue(value.title)} style={{ paddingTop: 4, paddingBottom: 4 }}>
                                 <Text style={{ fontSize: 18, padding:3}} >{value.title}</Text>
                                 </TouchableOpacity>
                    })}

                    <TouchableOpacity  onPress={() => this.togglePicker()} style={{ paddingTop: 4, paddingBottom: 4}}>
                      <Text style={{ color: '#999'}}>Cancel</Text>
                    </TouchableOpacity>
                    </View>

               
               </Modal>

               <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />
             
          

            </View>
       
     } 

 }

 QsoMode.propTypes = {
   
};


 const mapStateToProps = state => {
    return {        
        mode: state.sqso.currentQso.mode,
        band: state.sqso.currentQso.band,
        qsotype: state.sqso.currentQso.qsotype,
        qsoqras: state.sqso.currentQso.qsoqras,
        sqlrdsid: state.sqso.currentQso.sqlrdsId,
        isfetching: state.sqso.isfetching,
        qra: state.sqso.qra, 
        latitude: state.sqso.currentQso.latitude,
        longitude: state.sqso.currentQso.longitude,  
     };
};


const mapDispatchToProps = {
    setMode,
    postQsoNew,
    onprogressTrue,
    onprogressFalse,
    postQsoEdit,
    actindicatorPostQsoNewTrue
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoMode);

