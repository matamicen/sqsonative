import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator,  PermissionsAndroid, TouchableOpacity,
        Platform } from 'react-native';
import { connect } from 'react-redux';
import { addMedia, sendActualMedia, actindicatorImageDisabled, openModalConfirmPhoto,
  closeModalRecording } from '../../actions';
import {
    Dimensions,
    
    Slider,
    StyleSheet,

    TouchableHighlight,

  } from 'react-native';
//  import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Amplify, { Auth, API, Storage } from 'aws-amplify'
import awsconfig from '../../aws-exports'

Amplify.configure(awsconfig);


  // class Icon {
  //   constructor(module, width, height) {
  //     this.module = module;
  //     this.width = width;
  //     this.height = height;
  //     Asset.fromModule(this.module).downloadAsync();
  //   }
  // }
  
  // const ICON_RECORD_BUTTON = new Icon(require('../assets/images/record_button.png'), 70, 119);
  // const ICON_RECORDING = new Icon(require('../assets/images/record_icon.png'), 20, 14);
  
  // const ICON_PLAY_BUTTON = new Icon(require('../assets/images/play_button.png'), 34, 51);
  // const ICON_PAUSE_BUTTON = new Icon(require('../assets/images/pause_button.png'), 34, 51);
  // const ICON_STOP_BUTTON = new Icon(require('../assets/images/stop_button.png'), 22, 22);
  
  // const ICON_MUTED_BUTTON = new Icon(require('../assets/images/muted_button.png'), 67, 58);
  // const ICON_UNMUTED_BUTTON = new Icon(require('../assets/images/unmuted_button.png'), 67, 58);
  
  // const ICON_TRACK_1 = new Icon(require('../assets/images/track_1.png'), 166, 5);
  // const ICON_THUMB_1 = new Icon(require('../assets/images/thumb_1.png'), 18, 19);
  // const ICON_THUMB_2 = new Icon(require('../assets/images/thumb_2.png'), 15, 19);
  
  const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
  const BACKGROUND_COLOR = '#FFF8ED';
  const LIVE_COLOR = '#FF0000';
  const DISABLED_OPACITY = 0.5;
  const RATE_SCALE = 3.0;

  const RECORDING_OPTIONS_MATIAS = {
    // android: {
    //   extension: '.mp4',
    //    outputFormat: Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    //    audioEncoder: Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    //   // outputFormat: Expo.Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
    //   // audioEncoder: Expo.Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    //   sampleRate: 11025,
    //   numberOfChannels: 1,
    //   bitRate: 32000,
    // },
    // ios: {
    //  extension: '.mp4',
    //    outputFormat: Expo.Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    //   // audioQuality: Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    // //  extension: '.caf',
    //  // audioQuality: Expo.Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
 
    //   sampleRate: 11025,
    //   numberOfChannels: 1,
    //   bitRate: 32000,
    //   linearPCMBitDepth: 16,
    //   linearPCMIsBigEndian: false,
    //   linearPCMIsFloat: false,
    // },
  };
  
class RecordAudio2 extends Component {
    constructor(props) {
        super(props);
        this.recording = null;
        this.sound = null;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.cancel = false;
        this.restar = 0;
        this.secondsAux = 0;
        this.multiplo60anterior = 0;
        // this.state = {
        //   haveRecordingPermissions: false,
        //   isLoading: false,
        //   isPlaybackAllowed: false,
        //   muted: false,
        //   soundPosition: null,
        //   soundDuration: null,
        //   recordingDuration: null,
        //   shouldPlay: false,
        //   isPlaying: false,
        //   isRecording: false,
        //   fontLoaded: false,
        //   shouldCorrectPitch: true,
        //   volume: 1.0,
        //   rate: 1.0,
        // };
      this.state = {
        currentTime: 0.0,
        minutes: 0,
        seconds: 0,
        restar: 0,
        secondsText: '00',
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test2.mp4',
        hasPermission: undefined,
        pausedAudio: false,
        currentTimePlay: 0.0,
      };

     //   this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
    // this.recordingSettings = JSON.parse(JSON.stringify(RECORDING_OPTIONS_MATIAS));
     //Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        // // UNCOMMENT THIS TO TEST maxFileSize:
        // this.recordingSettings.android['maxFileSize'] = 12000;
      }


      prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: "Medium",
          AudioEncoding: "aac",
          AudioEncodingBitRate: 32000
        });
      }
        
    
     async componentDidMount() {
        // componentDidMount = async () => {
       
        this._checkPermission().then((hasPermission) => {
          this.setState({ hasPermission });
    
          if (!hasPermission) return;
    
          this.prepareRecordingPath(this.state.audioPath);
    
          AudioRecorder.onProgress = (data) => {

            if (Math.floor(data.currentTime)===0) 
               console.log('es cero los segundos');
               else
      {
     
    // console.log('divido: '+ Math.floor(data.currentTime)/60);
    // console.log('Resto: '+Math.floor(data.currentTime)%60);

              if (Math.floor(data.currentTime)%60===0 && Math.floor(data.currentTime)!==this.multiplo60anterior)
             {
               console.log('es multiplo verdadero');
              this.setState({minutes: this.state.minutes + 1});
              this.restar = this.restar + 60;
              this.multiplo60anterior = Math.floor(data.currentTime);
            
            }
         
            this.secondsAux = Math.floor(data.currentTime) - this.restar;

            if (this.secondsAux<10) 
               this.setState({secondsText: '0'+ this.secondsAux});
            else 
              this.setState({secondsText: this.secondsAux});
     
            // console.log('Seconds: '+this.state.secondsText + ' Minutes: '+this.state.minutes);
          }

       };


    
          AudioRecorder.onFinished = (data) => {
            // Android callback comes in the form of a promise instead.
            if (Platform.OS === 'ios') {
               this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
               console.log('url de evento OnFinish:'+data.audioFileURL + ' ' + data.audioFileSize)
               
              //    fileaux =  data.audioFileURL;
              //    fileName2 = fileaux.replace(/^.*[\\\/]/, '');
         
              //    envio = {name: fileName2, url: fileaux, type: 'audio', sent: 'false', size: '777' } 
                 
              //    vari2 = await this.props.sendActualMedia(envio);
               
              //  this.props.openModalConfirmPhoto();
              //  this.props.closeModal();
            }
          };
          console.log('pasa por aca');
          this._record();
     });
         
        
      
      }
    
      // _askForPermissions = async () => {
      //   const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      //   this.setState({
      //     haveRecordingPermissions: response.status === 'granted',
      //   });
      // };

    
      // _updateScreenForSoundStatus = status => {
      //   if (status.isLoaded) {
      //     this.setState({
      //       soundDuration: status.durationMillis,
      //       soundPosition: status.positionMillis,
      //       shouldPlay: status.shouldPlay,
      //       isPlaying: status.isPlaying,
      //       rate: status.rate,
      //       muted: status.isMuted,
      //       volume: status.volume,
      //       shouldCorrectPitch: status.shouldCorrectPitch,
      //       isPlaybackAllowed: true,
      //     });
      //   } else {
      //     this.setState({
      //       soundDuration: null,
      //       soundPosition: null,
      //       isPlaybackAllowed: false,
      //     });
      //     if (status.error) {
      //       console.log(`FATAL PLAYER ERROR: ${status.error}`);
      //     }
      //   }
      // };
    
      // _updateScreenForRecordingStatus = status => {
      //   if (status.canRecord) {
      //     this.setState({
      //       isRecording: status.isRecording,
      //       recordingDuration: status.durationMillis,
      //     });
      //   } else if (status.isDoneRecording) {
      //     this.setState({
      //       isRecording: false,
      //       recordingDuration: status.durationMillis,
      //     });
      //     if (!this.state.isLoading) {
      //       this._stopRecordingAndEnablePlayback();
      //     }
      //   }
      // };
    
      async _stopPlaybackAndBeginRecording() {
        this.setState({
          isLoading: true,
        });
        // if (this.sound !== null) {
        //   await this.sound.unloadAsync();
        //   this.sound.setOnPlaybackStatusUpdate(null);
        //   this.sound = null;
        // }
        // await Audio.setAudioModeAsync({
        //   allowsRecordingIOS: true,
        //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //   playsInSilentModeIOS: true,
        //   shouldDuckAndroid: true,
        //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        // });
        // if (this.recording !== null) {
        //   this.recording.setOnRecordingStatusUpdate(null);
        //   this.recording = null;
        // }
    
        // const recording = new Audio.Recording();
        // await recording.prepareToRecordAsync(this.recordingSettings);
        // recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
    
        // this.recording = recording;
        // await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
        // this.setState({
        //   isLoading: false,
        // });
      }
    
      async _stopRecordingAndEnablePlayback() {
        this.setState({
          isLoading: true,
        });
        // try {
        //   await this.recording.stopAndUnloadAsync();
        // } catch (error) {
        //   // Do nothing -- we are already unloaded.
        // }
        // const info = await FileSystem.getInfoAsync(this.recording.getURI());
        // console.log(`FILE INFO: ${JSON.stringify(info)}`);
        // await Audio.setAudioModeAsync({
        //   allowsRecordingIOS: false,
        //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //   playsInSilentModeIOS: true,
        //   playsInSilentLockedModeIOS: true,
        //   shouldDuckAndroid: true,
        //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        // });
        // const { sound, status } = await this.recording.createNewLoadedSound(
        //   {
        //     isLooping: true,
        //     isMuted: this.state.muted,
        //     volume: this.state.volume,
        //     rate: this.state.rate,
        //     shouldCorrectPitch: this.state.shouldCorrectPitch,
        //   },
        //   this._updateScreenForSoundStatus
        // );
        // this.sound = sound;
        // this.setState({
        //   isLoading: false,
        // });

//agrego subir a s3

this.props.closeModalRecording();

console.log("subo a s3 con BLOB el AUDIO");
// const response = await fetch(this.props.imageurl);
// const blob = await response.blob();
fileaux =  this.recording.getURI();
console.log("fileaux uri:"+ fileaux);

fileName2 = fileaux.replace(/^.*[\\\/]/, '');

     // agrego a array de media del store
    //  envio = {name: fileName2, url: fileaux, type: 'audio'} 
                
    //  this.props.addMedia(envio);

     envio = {name: fileName2, url: fileaux, type: 'audio', sent: 'false', size: '777' } 
    
     vari2 = await this.props.sendActualMedia(envio);

  //    setTimeout(() => {
  //     console.log("hago esperar 1200ms para q siempre se abra el modal en qsoScreen");
  //     this.props.actindicatorImageDisabled();
  //      this.props.openModalConfirmPhoto();
  //  }, 1000);
  this.props.openModalConfirmPhoto(290);

    //  envio = {name: fileName2, url: fileaux, type: 'audio', sent: false , status: 'inprogress', progress: 0.3, size: this.props.sqsomedia.size } 
                
    //  this.props.addMedia(envio);


// Fin de agrego a array de media del store




//   const response = await fetch(fileaux);
//   const blobi = await response.blob();

// try{

// const stored = await Storage.vault.put(fileName2, blobi, {
//   level: 'protected'})
//   .then (result => console.log(result))
//   .catch(err => console.log(err));
  
  
//   }
//   catch (e) {
//       console.log('S3 upload error:', e);
//        // Handle exceptions
//      }
// fin de subir a s3

      }

async _record() {
  if (this.state.recording) {
    console.warn('Already recording!');
    return;
  }else{
   // audioname = getAudioName();
    var audioname = Date.now();
    console.log('el audio name recording: '+ audioname + '  mili:'+ audioname);
    pathcompleto = AudioUtils.DocumentDirectoryPath + '/'+this.props.sqlrdsid+'_'+audioname + '.mp4'
    this.setState({audioPath: pathcompleto});
    this.prepareRecordingPath(pathcompleto);

  }

  if (!this.state.hasPermission) {
    console.warn('Can\'t record, no permission granted!');
    return;
  }

  if(this.state.stoppedRecording){
    
    this.prepareRecordingPath(this.state.audioPath);
    
  }

  this.setState({recording: true, paused: false});

  try {
    console.log('comienzo a grabar');
    const filePath = await AudioRecorder.startRecording();
  } catch (error) {
    console.error(error);
  }
}



// firstStop = async () => {


  
//   await this.props.closeModalRecording();

//   filepath = await this._stop();
//   fileaux =  filepath;
//   console.log("fileaux uri:"+ fileaux);

//   fileName2 = fileaux.replace(/^.*[\\\/]/, '');

//      envio = {name: fileName2, url: fileaux, type: 'audio', sent: 'false', size: '777' } 
    
//      vari2 = await this.props.sendActualMedia(envio);

//      await this.props.openModalConfirmPhoto();

   

// }

stopRecording = async () => {
  filepath = await this._stop();

  // this._stop().then(response => {
  //       console.log('termino el _stop path: '+JSON.stringify(response));
  //   })
 // console.log('stopRecording el path: '+filepath);
     
 // anda en ANDROID pero no en iOS porque no le llega a tiempo el filepath
      // fileaux =  filepath;
      // fileName2 = fileaux.replace(/^.*[\\\/]/, '');

      //   envio = {name: fileName2, url: fileaux, type: 'audio', sent: 'false', size: '777' } 
        
      //   vari2 = await this.props.sendActualMedia(envio);

 //       this.props.openModalConfirmPhoto();
 // this.props.closeModal();
  


}

_stop = async () => {
  if (!this.state.recording) {
    console.warn('Can\'t stop, not recording!');
    return;
  }

  await this.setState({stoppedRecording: true, recording: false, paused: false});
  //this.props.closeModalRecording();
  

  try {
    
    const filePath = await AudioRecorder.stopRecording();
    console.log('stringeo filePath: '+ JSON.stringify(filePath));
    //await this.envio(filePath);


   // filePath = await AudioRecorder.stopRecording();
  
    console.log('El filePath: '+filePath);

    if (Platform.OS === 'android') {
      await this._finishRecording(true, filePath);
    }

  
    return filePath;
  } catch (error) {
    console.error(error);
  }
}



//_finishRecording(didSucceed, filePath, fileSize) {
  _finishRecording = async (didSucceed, filePath, fileSize) => {
  this.setState({ finished: didSucceed });
  console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
  
  // if (Platform.OS === 'ios') {

  if (!this.cancel)
  {
    fileaux =  filePath;
                 fileName2 = fileaux.replace(/^.*[\\\/]/, '');
         
                 envio = {name: fileName2, url: fileaux, type: 'audio', sent: 'false', size: '777' } 
                 
                 vari2 = await this.props.sendActualMedia(envio);
               
               this.props.openModalConfirmPhoto(290);
  }
               this.props.closeModal();
  // }

}

_checkPermission() {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  const rationale = {
    'title': 'Microphone Permission',
    'message': 'AudioExample needs access to your microphone so you can record audio.'
  };

  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
    .then((result) => {
      console.log('Permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

cancelRecording = async () => {
  this.cancel = true;
  this.stopRecording();

}

      render() {
        
         return <View style={{flex: 1}} >
           {/* ,justifyContent:"center", alignContent: "center" */}
          <View style={{flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 36, color: 'red'}}>REC</Text>
          
         
           <Text style={{ fontSize: 24, color: '#999'}}> {this.state.minutes}:{this.state.secondsText}</Text>

               {/* <TouchableOpacity style={{marginLeft:180}}  onPress={ () => this._record() }>
                    <Image source={require('../../images/mic.png')}  style={{width: 33, height: 33 } } 
                 resizeMode="contain" />    
                 <Text style={{ fontSize: 12, color: '#999'}}>Record</Text> 
                 
         
                </TouchableOpacity> */}

                 {/* <TouchableOpacity style={{marginLeft:180}}  onPress={ () => this.stopRecording() }> */}
                 <TouchableOpacity onPress={ () => this.stopRecording() }> 
                    <Image source={require('../../images/stop5.png')}  style={{width: 37, height: 37 } } 
                 resizeMode="contain" />    
                 <Text style={{ fontSize: 12, color: '#999', marginLeft: 5}}>Stop</Text>          
                </TouchableOpacity>

            </View>

                {/* <TouchableOpacity  onPress={() => this.cancelRecording()} >
                             <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                 </TouchableOpacity>  */}
      
          </View>
       
      }



    }
    
    const styles = StyleSheet.create({
      emptyContainer: {
        alignSelf: 'stretch',
        backgroundColor: BACKGROUND_COLOR,
      },
      container: {
        flex: 1,
        flexDirection: 'column',
      //  justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: BACKGROUND_COLOR,
        minHeight: DEVICE_HEIGHT,
        maxHeight: DEVICE_HEIGHT,
      },
      noPermissionsText: {
        textAlign: 'center',
      },
      wrapper: {},
      halfScreenContainer: {
        flex: 1,
        flexDirection: 'column',
      //  justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        minHeight: DEVICE_HEIGHT / 2.0,
        maxHeight: DEVICE_HEIGHT / 2.0,
      },
      recordingContainer: {
        flex: 1,
        flexDirection: 'row',
     //   justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        // minHeight: ICON_RECORD_BUTTON.height,
        // maxHeight: ICON_RECORD_BUTTON.height,
      },
      recordingDataContainer: {
        flex: 1,
        flexDirection: 'column',
     //   justifyContent: 'space-between',
        alignItems: 'center',
        // minHeight: ICON_RECORD_BUTTON.height,
        // maxHeight: ICON_RECORD_BUTTON.height,
        // minWidth: ICON_RECORD_BUTTON.width * 3.0,
        // maxWidth: ICON_RECORD_BUTTON.width * 3.0,
      },
      recordingDataRowContainer: {
        flex: 1,
        flexDirection: 'row',
     //   justifyContent: 'space-between',
        alignItems: 'center',
        // minHeight: ICON_RECORDING.height,
        // maxHeight: ICON_RECORDING.height,
      },
      playbackContainer: {
        flex: 1,
        flexDirection: 'column',
     //   justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        // minHeight: ICON_THUMB_1.height * 2.0,
        // maxHeight: ICON_THUMB_1.height * 2.0,
      },
      playbackSlider: {
        alignSelf: 'stretch',
      },
      liveText: {
        color: LIVE_COLOR,
      },
      recordingTimestamp: {
        paddingLeft: 20,
      },
      playbackTimestamp: {
        textAlign: 'right',
        alignSelf: 'stretch',
        paddingRight: 20,
      },
      image: {
        backgroundColor: BACKGROUND_COLOR,
      },
      textButton: {
        backgroundColor: BACKGROUND_COLOR,
        padding: 10,
      },
      buttonsContainerBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
     //   justifyContent: 'space-between',
      },
      buttonsContainerTopRow: {
        // maxHeight: ICON_MUTED_BUTTON.height,
        alignSelf: 'stretch',
        paddingRight: 20,
      },
      playStopContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      //  justifyContent: 'space-between',
        // minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
        // maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
      },
      volumeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    //    justifyContent: 'space-between',
        minWidth: DEVICE_WIDTH / 2.0,
        maxWidth: DEVICE_WIDTH / 2.0,
      },
      volumeSlider: {
        // width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
      },
      buttonsContainerBottomRow: {
        // maxHeight: ICON_THUMB_1.height,
        alignSelf: 'stretch',
        paddingRight: 20,
        paddingLeft: 20,
      },
      rateSlider: {
        width: DEVICE_WIDTH / 2.0,
      },
    });



 const mapStateToProps = state => {
    // return {  index: state.nav.index, };
    return {  audiorecordingpermission: state.sqso.audiorecordingpermission,
              sqlrdsid: state.sqso.currentQso.sqlrdsId};
};


const mapDispatchToProps = {
       addMedia,
       sendActualMedia, 
       actindicatorImageDisabled,
       openModalConfirmPhoto,
       closeModalRecording
   }

export default connect(mapStateToProps, mapDispatchToProps)(RecordAudio2);
