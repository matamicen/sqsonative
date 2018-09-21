import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid, 
  TouchableOpacity,
  Image
} from 'react-native';


import Video from 'react-native-video';

 class PlayMediaAudio extends Component {
  
    constructor(props) {
        super(props);

       // this.followstatus = '';
       this.state = {
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
       // audioPath: AudioUtils.DocumentDirectoryPath + '/test.mp4',
        hasPermission: undefined,
        pausedAudio: true,
        currentTimePlay: 0.0,
        playingAudio: false
      };
        
      }
  

//   prepareRecordingPath(audioPath){
//     AudioRecorder.prepareRecordingAtPath(audioPath, {
//       SampleRate: 22050,
//       Channels: 1,
//       AudioQuality: "Medium",
//       AudioEncoding: "aac",
//       AudioEncodingBitRate: 32000
//     });
//   }

  componentDidMount() {
    // this._checkPermission().then((hasPermission) => {
    //   this.setState({ hasPermission });

    //   if (!hasPermission) return;

    
    // });
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


  PauseAudio = () => {
   
    this.setState({pausedAudio: true, playingAudio: false});
   
  }

  PlayAudio = () => {
   
    this.setState({pausedAudio: false, playingAudio: true});
   
  }

  onEnd = async () => {
  
    console.log('termino el audio! lo pauso y lo vuelvo al inicio');
    this.setState({pausedAudio: true, playingAudio: false});
    setTimeout(() => {
      console.log("hago esperar 1200ms para q siempre se abra el modal en qsoScreen");
     //  this.props.actindicatorImageDisabled();
     this.player.seek(0);
       
   }, 250);
   
  }

  onVideoLoad(e) {
    this.setState({currentTimePlay: e.currentTime, duration: e.duration});
    console.log('duracion: '+  Math.floor(e.duration));
    
   // console.log('duracion Float: '+ Math.floor(e.duration));
    //parseFloat
}

  onProgress(e) {
    //this.setState({currentTime: e.currentTime});
   // console.log('Progress: '+ e.currentTime + ' anterior: '+this.state.currentTimePlay);
    if (Math.floor(this.state.currentTimePlay) !== Math.floor(e.currentTime))
    {
       console.log('Progress '+ this.props.url + ': ' + Math.floor( e.currentTime));
       this.setState({currentTimePlay: e.currentTime});
    }

   // this.setState({currentTime: e.currentTime})
}


  render() {

    return (
    //   <View style={styles.container}>
    <View style={{ alignItems: 'center', width:200}}>
      <View style={{ flexDirection: 'row'}}>
      
       

          {(this.state.playingAudio===false) ?
           <TouchableOpacity  style={{}}  onPress={ () => this.PlayAudio() }>
                  
                  <Image source={require('../../images/playMedia.png')}  style={{width: 50, height: 50 } } 
               resizeMode="contain" />    
               
           </TouchableOpacity> 
           :
           <TouchableOpacity  style={{}}  onPress={ () => this.PauseAudio() }>
                  
                  <Image source={require('../../images/pauseMedia.png')}  style={{width: 50, height: 50 } } 
               resizeMode="contain" />    
               
           </TouchableOpacity> 
          }
         
           
           <TouchableOpacity  style={{marginLeft: 10 }}  onPress={ () => this.onEnd() }>
                  
                  <Image source={require('../../images/stopMedia.png')}  style={{width: 50, height: 50 } } 
               resizeMode="contain" />    
               
           </TouchableOpacity> 
          
       </View>
       <View>

         
           <Text> QTR: {this.props.datetime.substr(11, 8)}</Text>
           <Text>  {this.props.description}</Text>

          
          {/* http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4 */}
          <Video source={{uri: this.props.url}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onLoad={this.onVideoLoad.bind(this)}
       onEnd={this.onEnd}                      // Callback when playback finishes
       onError={this.videoError}               // Callback when video cannot be loaded
    //    style={styles.backgroundVideo} 
       audioOnly={true}
       onProgress={this.onProgress.bind(this)}
       
       paused={this.state.pausedAudio} />

      </View>
       
         
        
        
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b608a",
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 50,
    bottom: 550,
    right: 50,
  }

});


const mapStateToProps = state => {
    return { 
    }
          
};


const mapDispatchToProps = {
 
   }

export default connect(mapStateToProps, mapDispatchToProps)(PlayMediaAudio);