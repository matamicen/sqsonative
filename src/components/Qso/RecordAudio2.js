import React, { Component } from 'react';
import { Text, Image, View, Button, ActivityIndicator } from 'react-native';
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
        this.state = {
          haveRecordingPermissions: false,
          isLoading: false,
          isPlaybackAllowed: false,
          muted: false,
          soundPosition: null,
          soundDuration: null,
          recordingDuration: null,
          shouldPlay: false,
          isPlaying: false,
          isRecording: false,
          fontLoaded: false,
          shouldCorrectPitch: true,
          volume: 1.0,
          rate: 1.0,
        };

        
     //   this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
     this.recordingSettings = JSON.parse(JSON.stringify(RECORDING_OPTIONS_MATIAS));
     //Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        // // UNCOMMENT THIS TO TEST maxFileSize:
        // this.recordingSettings.android['maxFileSize'] = 12000;
      }
    
      async componentDidMount() {
      //   (async () => {
      //     await Font.loadAsync({
      //       'cutive-mono-regular': require('../assets/fonts/CutiveMono-Regular.ttf'),
      //     });
      //     this.setState({ fontLoaded: true });
      //   })();
      //  // await this._askForPermissions();

      //  // inicio grabando
      //  this._stopPlaybackAndBeginRecording();
        
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
  this.props.openModalConfirmPhoto();

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



      render() {
        
          <View >
            <Text> Hola RecordAudio2 </Text>
      
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
    return {  audiorecordingpermission: state.sqso.audiorecordingpermission};
};


const mapDispatchToProps = {
       addMedia,
       sendActualMedia, 
       actindicatorImageDisabled,
       openModalConfirmPhoto,
       closeModalRecording
   }

export default connect(mapStateToProps, mapDispatchToProps)(RecordAudio2);
