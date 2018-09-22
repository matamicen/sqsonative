import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, Modal, StyleSheet, TextInput,
     TouchableOpacity } from 'react-native';
     import {Keyboard} from 'react-native'
     import { connect } from 'react-redux';
import { addQra, onprogressTrue, onprogressFalse, fetchQraProfileUrl, postQsoNew, postQsoQras,
  actindicatorPostQsoNewTrue } from '../../actions';
import PropTypes from 'prop-types';
import { updateOnProgress, check_firstTime_OnProgress} from '../../helper';
import { hasAPIConnection } from '../../helper';
import NoInternetModal from './NoInternetModal';


class QsoEnterQra extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
       //   pickerSelection: 'Choose Band',
         // pickerDisplayed: false
         qra: '',
         envio: {name: 'LW8PPP', url: 'https://s3.amazonaws.com/sqso/us-east-1%3A29a10ff3-e4d7-45cf-a432-7821674b8d77/profile/profile.jpg'},
         nointernet: false
         
        };
      }

    componentDidMount() {
 
       }

    
       addQra = async () => {
     //     this.setState({pickerSelection: value});


    if (await hasAPIConnection())
        {
        // chequea el haya una API en ejecucion
        if(!this.props.isfetching && this.state.qra !== '')
        { 
           console.log("ejecuta addQRA");

   //       qra = {name: this.state.qra.toUpperCase(), url: 'https://randomuser.me/api/portraits/med/men/72.jpg'} 
          qra = {qra: this.state.qra.toUpperCase(), url: 'empty', sent: 'false', deleted: 'false', deletedSent: 'false', following: ''} 
    
          // hay que darle tiempo a que agregue el QRA al store asi despues chequea bien el onProgress
          await this.props.addQra(qra);
          // update si el QSO esta onProress 
          if (ONPROGRESS=updateOnProgress(this.props.qsotype,this.props.band,this.props.mode,this.props.qsoqras))
                  await this.props.onprogressTrue();
             else
                   this.props.onprogressFalse();

              
                  console.log("QRA OWNER:"+this.props.qra);

         // busco URL del profile
           this.props.fetchQraProfileUrl(this.state.qra.toUpperCase());

          
          if (this.props.sqlrdsid===''){
            
            // chequeo si esta OnProgress para poder obtener el SqlRdsID de AWS RDS
          if (ONPROGRESS) {
           data = check_firstTime_OnProgress(this.props.qsotype,this.props.band,this.props.mode,
                                        this.props.qra,ONPROGRESS,this.props.sqlrdsid,this.props.latitude,
                                        this.props.longitude);
                console.log("Data to Send API: "+ JSON.stringify(data));  
              
               this.props.actindicatorPostQsoNewTrue();
               this.props.postQsoNew(data,this.props.qsoqras);
               
          }else console.log("Todavia no esta OnProgreSSS como para llamar a PostNewQso");
            
          }else {
             qraToAddRds = [];
             qraToAddRds.push(qra);
             await this.props.postQsoQras("OnlyOneQra",this.props.sqlrdsid,qraToAddRds);
               }         
        }
        else console.log("se esta ejecutando una API o no se ingreso un QRA, no permite ejecutar otra api al mismo tiempo");

          Keyboard.dismiss();
          this.setState({qra: ''});
      }
          else this.setState({nointernet: true});
        
    }

    closeNoInternetModal = () => {
      this.setState({nointernet: false}); 
    }
   

    render() { console.log("RENDER Enter QRA" );
    
              return <View style={{flexDirection: 'row'}}>  
                    
        
                   <TextInput style={{height: 40, width:90, fontSize: 16, marginTop: 8}}
                    placeholder="enter Qra" value={this.state.qra}
                    onChangeText={(text) => this.setState({qra: text})}  />
  <TouchableOpacity  onPress={ () => this.addQra() }>
                    <Image source={require('../../images/personadd.png')}  style={{width: 38, height: 38, marginTop: 3 } } 
                 resizeMode="contain" />              
           </TouchableOpacity>

           <NoInternetModal nointernet={this.state.nointernet} closeInternetModal={this.closeNoInternetModal.bind()} />

       
                                                 


                          </View>
       
     } 

 }

 QsoEnterQra.propTypes = {
   
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
         onprogress: state.sqso.currentQso.onProgress,
         latitude: state.sqso.currentQso.latitude,
         longitude: state.sqso.currentQso.longitude,
       };
};


const mapDispatchToProps = {
    addQra,
    onprogressTrue,
    onprogressFalse,
    fetchQraProfileUrl,
    postQsoNew,
    postQsoQras,
    actindicatorPostQsoNewTrue
   }

export default connect(mapStateToProps, mapDispatchToProps)(QsoEnterQra);

