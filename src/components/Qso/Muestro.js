import React, { Component } from 'react';
//import {FileSystem } from 'expo';
import { connect } from 'react-redux';
import { addMedia, updateMedia, closeModalConfirmPhoto, postAddMedia, uploadMediaToS3, sendActualMedia } from '../../actions';
import { Text, Image, View, Button, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput,
  TouchableHighlight, KeyboardAvoidingView, Platform, Dimensions   } from 'react-native';
import { getDate} from '../../helper';
import Amplify, { Auth, API, Storage } from 'aws-amplify'
import awsconfig from '../../aws-exports'
import ImageResizer from 'react-native-image-resizer';


Amplify.configure(awsconfig);

class Muestro extends Component {

    constructor(props) {
        super(props);

        this.width = 0;
        this.height = 0;
        this.size = 0;
        this.compressRotation = 86;
        this.compressImageURL = '';
        this.var12 = 'pepe';

    this.widthScreen = Dimensions.get('window').width; //full width
    this.heightScreen = Dimensions.get('window').height; //full height
        
        this.state = {
          people: [],
          errorMessage: "",
          isFetching: true.imageurl,
          tok: '',
          description: ''
        };
      }

  

   componentDidMount() {
    
      //  this.props.fetchPeople();
     
       }



  signIn = async () => {
        await Auth.signIn('LU2ACH', 'sabrina')
          .then(() => console.log('entro!'))
          .catch(err => console.log('error:', err))
    
        try {
          const { identityId } = await Auth.currentCredentials();
          console.log('la credencial es:' + identityId)
        }
        catch (e) {
          console.log('caught error', e);
          // Handle exceptions
        }
        session = await Auth.currentSession();
    
        console.log("token: " + session.idToken.jwtToken);
      }




      rotateImage = async () => {

        const dim = await this.getDimensions(this.props.sqsomedia.url);

        if (this.compressRotation===86){
          console.log(' entro 1era vez Compress Rotation: '+this.width + ' ' + this.height);
        nuevoWidth = this.width / 5.2;
        nuevoHeight = this.height / 5.2;

        }else{
          nuevoWidth = this.width; 
          nuevoHeight = this.height; 
          console.log(' entro 2da vez Compress Rotation: '+this.width + ' ' + this.height);
        }
    

        await ImageResizer.createResizedImage(this.props.sqsomedia.url, nuevoWidth , nuevoHeight, 'JPEG',this.compressRotation , 90).then((response) => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
       //   data.uri = response.uri;
       console.log('Compress Rotation: '+this.compressRotation); 
       this.compressRotation = 100;
          this.compressImageURL = response.uri;
          this.size = response.size;
          this.width = nuevoWidth;
          this.height = nuevoHeight;
          console.log(' Compress Rotation Rotate resize ImageResizer: ' + JSON.stringify(response));


        envio = {name: 'fileName2', url: this.compressImageURL, type: this.props.sqsomedia.type, sent: 'false', size: this.size , width: this.width, height: this.height } 
 
        this.props.sendActualMedia(envio);

        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });


      }


      getDimensions = (laUrl) => new Promise((resolve) => {
 
        Image.getSize(laUrl, (width, height) => {
         //   console.log('SIZE 4: ancho: '+width + ' alto:'+height);
            this.width = width;
            this.height = height;
                  resolve(1234)
             });
     
       })


      compressImage = async () => {
        this.var12 = 'Jose';
        inicial = new Date();
        const dim = await this.getDimensions(this.props.sqsomedia.url)
        final = new Date();
        total = final - inicial;
        
        console.log('dim'+dim);
        console.log('tardoMuestro en total obtener info de foto: '+ total + ' width:'+ this.width + ' height:'+ this.height)


        nuevoWidth = this.width / 5.2;
        nuevoHeight = this.height / 5.2;
    
        inicial = new Date();
        await ImageResizer.createResizedImage(this.props.sqsomedia.url, nuevoWidth , nuevoHeight, 'JPEG', 86).then((response) => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
       //   data.uri = response.uri;
          this.compressImageURL = response.uri;
          this.size = response.size;
          this.width = nuevoWidth;
          this.height = nuevoHeight;
          console.log('resize ImageResizer: ' + JSON.stringify(response));
         

        // envio = {name: 'fileName2', url: this.compressImageURL, type: 'image', sent: 'false', size: this.size , width: this.width, height: this.height } 
 
        // this.props.sendActualMedia(envio);


        }).catch((err) => {
          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
        final = new Date();
        total = final - inicial;
        console.log('tardoMuestro en total en achicar la imagen: '+ total)

       

      }

      subo_s3 = async () => {

        this.props.closeModalConfirmPhoto();

        console.log("subo a s3 con BLOB");

        console.log('var12 antes: '+this.var12);

        if (this.props.sqsomedia.type==='image' || this.props.sqsomedia.type==='profile') {
        //  if the media is a photo -> Compress Imgae
        if (this.compressRotation===86){ 
          console.log('entro a comprimir valor de compressRotation: '+ this.compressRotation);
           await this.compressImage();
             }else
             {
               // switch de width con height porque la foto fue girada y el feed necesita calcular el espacio
               auxWidth = this.width;
               this.width = this.height;
               this.height = auxWidth;
             }
            // fileaux =  this.props.sqsomedia.url;
            fileaux = this.compressImageURL;

        } else
          {
           fileaux =  this.props.sqsomedia.url;
           this.size = this.props.sqsomedia.size;

          }


        console.log('var12 despues: '+this.var12);


       
    //  fileaux =  this.props.sqsomedia.url;
   
      console.log("fileaux uri:"+ fileaux);

        fileName2 = fileaux.replace(/^.*[\\\/]/, '');

        if (this.props.sqsomedia.type==='image') {
             folder = 'images/'+fileName2;
           
        }
          else folder = 'audios/'+fileName2;


          if (this.props.sqsomedia.type==='profile') 
            { 
              folder = 'profile/profile.jpg';
              // para que no se repita el nombre en la lista de enviados si sue mas de 1 vez su profile picture 
              //  fileNameaux = fileName2+''+ new Date().getTime();
              //  fileName2 = fileNameaux;
              
              fileName2 = 'profile.jpg'+ new Date().getTime();
            }
          
       
        rdsUrl = this.props.rdsurls3+folder;




        console.log('RDSurl: '+rdsUrl);

      // fecha = this.getDate();
       fecha = getDate();
       console.log('la fecha es:' + fecha);
      //  console.log('jaja: '+  this.props.sqsomedia.width + this.props.sqsomedia.height  )

     //  console.log('SIZE 3:'+ this.width+ ' '+this.height);
      //  Image.getSize(fileaux, (width, height) => {console.log('SIZE 2: ancho: '+width + ' alto:'+height)});

        // agrego a array de media del store
          // envio = {name: fileName2, url: fileaux, sqlrdsid: this.props.sqlrdsid , description: this.state.description , type: this.props.sqsomedia.type, sent: false ,
          //    status: 'inprogress', progress: 0.3, size: this.props.sqsomedia.size, rdsUrlS3: rdsUrl, date: fecha, width: this.props.sqsomedia.width, height: this.props.sqsomedia.height  } 
                
             envio = {name: fileName2, url: fileaux, sqlrdsid: this.props.sqlrdsid , description: this.state.description , type: this.props.sqsomedia.type, sent: false ,
              status: 'inprogress', progress: 0.3, size: this.size, rdsUrlS3: rdsUrl, date: fecha, width: this.width, height: this.height  } 
                    
              
             
             this.props.addMedia(envio);

        // Fin de agrego a array de media del store
       
       
          // const response = await fetch(fileaux);
          // const blobi = await response.blob();
          
          // this.props.uploadMediaToS3(fileName2, fileaux, this.props.sqlrdsid, this.state.description,this.props.sqsomedia.size, this.props.sqsomedia.type, rdsUrl, fecha, this.props.sqsomedia.width, this.props.sqsomedia.height);
          this.props.uploadMediaToS3(fileName2, fileaux, this.props.sqlrdsid, this.state.description,this.size, this.props.sqsomedia.type, rdsUrl, fecha, this.width, this.height);

          //this.props.navigation.navigate("Root");
        

      }

     

      signOut = () => {
        Auth.signOut()
          .then(data => console.log(JSON.stringify(data)))
          .catch(err => console.log(err));
    
    
      }

      info = async () => {
        try {
          session = await Auth.currentSession();
         // session2 = await Auth.currentCredentials();
          console.log("Su token es: " + session.idToken.jwtToken);
         // console.log("Sus credenciales SON: " + JSON.stringify(session2));
          this.setState({ tok: session.idToken.jwtToken })
        }
        catch (e) {
          console.log('caught error', e);
          // Handle exceptions
        }
        //console.log("Su token es: "+ session.idToken.jwtToken);   
      }

    render() { 
        // this.props.imageurl
        console.log("RENDER MUESTRO, mediatosend: " +JSON.stringify(this.props.sqsomedia));
           
   
              
        return( 
          
        <View >
            
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
            { (this.props.sqsomedia.type==='image' || this.props.sqsomedia.type==='profile') ?
             <Image style={styles.faceImageStyle}
            source={{ uri: this.props.sqsomedia.url }}
          />
          :
          <Image style={styles.faceImageStyleAudio}
                      source={require('../../images/audio.png')}
                          /> }
            { ((this.props.sqsomedia.type==='image' || this.props.sqsomedia.type==='profile') && Platform.OS === 'android') &&
                   <TouchableOpacity  onPress={() => this.rotateImage()} >
                           <Image style={{ width: 26, height: 26,  marginTop: 5, marginLeft: 9}}
                      source={require('../../images/rotate.png')}
                          /> 

                         <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 13}}>Rotate</Text>
                    </TouchableOpacity>
            }

          </View>
        
            <View style={{ flexDirection: 'row'}}>
{/* width: this.widthScreen-80 */}
            { (this.props.sqsomedia.type!=='profile') &&
  
             <View style={{ height: 70}}>

              
                  <TextInput 
                  placeholder="description (Optional)"
                  
                  underlineColorAndroid='transparent'
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  
                  style={styles.input}
                  value={this.state.description}
                    onChangeText={(text) => this.setState({description: text})} />
            

             </View>
            }
            
             { (this.props.sqsomedia.type!=='profile') ?
              <View style={{   marginTop: 15, marginLeft: 8 }}>
                    <TouchableOpacity  onPress={() => this.subo_s3()} >
                      <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 16}}>Send</Text>
                    </TouchableOpacity>
                </View>  
                :
                <View style={{   marginTop: 15, marginLeft: 0 }}>
                    <TouchableOpacity  onPress={() => this.subo_s3()} >
                       <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 16}}>Send Profile Photo</Text>
                    </TouchableOpacity>
                    </View>  

            }
                   
              

             {/* <Text style={styles.name} >
                 imagen
             </Text>
             <TouchableOpacity  onPress={this.props.onPress}>
          <Text style={styles.name}>Back</Text>
        </TouchableOpacity>
      
        <TouchableOpacity  onPress={() => this.signIn()}>
          <Text style={styles.name}>signIN</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => this.info()}>
          <Text style={styles.name}>Info</Text>
        </TouchableOpacity> */}


        {/* <TouchableOpacity  onPress={() => this.signOut()}>
          <Text style={styles.name}>SignOut</Text>
        </TouchableOpacity> */}

            {/* <TouchableOpacity  onPress={() => this.subos3()}>
             <Text style={styles.name}>subo a s3</Text>
           </TouchableOpacity> */}

        </View>

         </View>
         
            
           
       
        )} 

 }

 
const styles = StyleSheet.create({
       faceImageStyle: {
       width: 150,
       height: 150,
       
    //   borderRadius: 30
       },
       faceImageStyleAudio: {
        width: 65,
        height: 65,
        borderRadius: 30
         },
    name:{
        fontSize: 16,
        marginLeft: 5,
        padding: 5,
        fontWeight: 'bold',        
        color: 'orange'        
    },
    input: {
      height: 40,
        
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 5,
      marginTop: 15,
      color: '#FFF',
      fontSize: 16,
      paddingHorizontal: 5,
      width: 200
            }
  });

  


  const mapStateToProps = state => {
    // return {  isTransitioning: state.nav.isTransitioning,
    //     index: state.nav.routes[0].index,
    //     sqso: state.sqso };
        return {  
          sqsomedia: state.sqso.currentQso.mediatosend,
          sqlrdsid: state.sqso.currentQso.sqlrdsId,
          rdsurls3: state.sqso.urlRdsS3,
           };
};


const mapDispatchToProps = {
    addMedia,
    updateMedia,
    closeModalConfirmPhoto,
    postAddMedia,
    uploadMediaToS3,
    sendActualMedia
   }

export default connect(mapStateToProps, mapDispatchToProps)(Muestro);


