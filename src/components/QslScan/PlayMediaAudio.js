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

        this.restar = 0;
        this.secondsAux = 0;
        this.multiplo60anterior = 0;
        this.duracionminutos = 0;
        this.duracionsegundos = 0;

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
        playingAudio: false,
        minutes: 0,
        // seconds: 0,
        // restar: 0,
        secondsText: '00',
        minutesDuration: 0,
        secondsDuration: 0
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
    this.setState({pausedAudio: true, playingAudio: false,  minutes: 0, secondsText: '00' });
    this.restar = 0;
    this.secondsAux = 0;
    this.multiplo60anterior = 0;
  
    setTimeout(() => {
      console.log("hago esperar 1200ms para q siempre se abra el modal en qsoScreen");
     //  this.props.actindicatorImageDisabled();
     this.player.seek(0);
       
   }, 200);
   
  }

  onVideoLoad(e) {
    this.setState({currentTimePlay: e.currentTime, duration: e.duration});
    console.log('duracion: '+  Math.floor(e.duration));
    this.duracionminutos = parseInt(Math.floor(e.duration)/60);
    console.log('duracionminutos:'+ this.duracionminutos );
 if (this.duracionminutos!==0)
    { 
    // this.duracionminutos = cuentaAux/60;
    // console.log('duracion en minutos:'+ this.duracionminutos);
    this.minutosensegundos = this.duracionminutos*60;
    this.duracionsegundos = (Math.floor(e.duration) - this.minutosensegundos);
    }else
    {
      this.duracionminutos = 0;
      this.duracionsegundos = Math.floor(e.duration);
    }

    if (this.duracionsegundos<10) 
    this.setState({secondsDuration: '0'+ this.duracionsegundos});
 else 
   this.setState({secondsDuration: this.duracionsegundos});

   // console.log('duracionsegundos:'+ this.duracionsegundos );
    this.setState({minutesDuration: this.duracionminutos});
    

   // console.log('duracion Float: '+ Math.floor(e.duration));
    //parseFloat
}

  onProgress(data) {
    
    // if (Math.floor(this.state.currentTimePlay) !== Math.floor(e.currentTime))
    // {
    //    console.log('Progress '+ this.props.url + ': ' + Math.floor( e.currentTime));
    //    this.setState({currentTimePlay: Math.floor(e.currentTime)});
    // }

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
       <View  style={{ alignItems: 'center', width:200}}>

           <Text> {this.state.minutes}:{this.state.secondsText} / {this.state.minutesDuration}:{this.state.secondsDuration}</Text>
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