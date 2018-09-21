import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, FlatList  } from 'react-native';
import { connect } from 'react-redux';
import { fetchPeople } from '../../actions';
import Media from './Media';
import PropTypes from 'prop-types';

class MediaImages extends Component {

    constructor(props) {
        super(props);
        
         }

  

   componentDidMount() {
    
      //  this.props.fetchPeople();
     
       }

       LlamoAPI = () => {
      //  this.props.fetchPeople();
        //this.props.navigation.navigate('CameraScreen');
      }

  _keyExtractor = item => item.url;


  

  _renderItem = ({ item }) => {
    const {  url, description , type, datetime } = item;

    return (
      <View>
       <View style={{ paddingRight: 8 }}>
        <Media  imageurl={url}  description={description} type={type} datetime={datetime} mostrar={this.props.mostrar}  />
        </View>
       
      </View>
    );
  };


    render() { console.log("RENDER qso Media Iamges Qsl Scan");
   
           
                           
              
        return( <View >
              {(this.props.sqsoqslscanerror===0) &&
              <Text style={{color:"grey" }}> Photos taken by <Text style={{color:"blue" }}>{this.props.sqsoqslscan.qra} </Text></Text> 
            }
            
            
              <FlatList  style={styles.qralist}
               
                data={this.props.sqsoqslscan.media}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                
               
               
                />

         </View>
            
           
       
        )} 

 }

 

 const styles = StyleSheet.create({
    
    qralist: {
        marginRight: 220,
        marginLeft: 10,
      //  marginBottom: 70,
      // maxHeight: 150
     
     
    }
  });

  MediaImages.propTypes = {
    
  };



 const mapStateToProps = state => {
    return {
        sqsoqslscan: state.sqso.currentQso.qslscan.body.message,
        sqsoqslscanerror: state.sqso.currentQso.qslscan.body.error
      };
};


const mapDispatchToProps = {
   
   }

export default connect(mapStateToProps, mapDispatchToProps)(MediaImages);