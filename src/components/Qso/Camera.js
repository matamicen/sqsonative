//import { Constants, Camera, FileSystem, Permissions, ImageManipulator } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Vibration, Platform, ActivityIndicator } from 'react-native';
//import GalleryScreen from './GalleryScreen';
import Muestro from './Muestro';
import isIPhoneX from 'react-native-is-iphonex';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import { openModalConfirmPhoto, sendActualMedia, actindicatorImageDisabled,
         actindicatorImageEnabled } from '../../actions';

const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    photoId: 1,
    showGallery: false,
    photos: [],
    faces: [],
    permissionsGranted: false,
    uriresize: ''
  };

  // async UNSAFE_componentWillMount() {
  //   // const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   // this.setState({ permissionsGranted: status === 'granted' });
  //   // Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.ALL);
  // }

  async componentDidMount() {
    // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
    //   console.log(e, 'Directory exists');
   // });
    //  const { status } = await Permissions.askAsync(Permissions.CAMERA);
    //  this.setState({ permissionsGranted: status === 'granted' });
  }

  navigateRoot = () => {
    const navigateToScreen2 = NavigationActions.navigate({
      routeName:'Root'
     
    })

    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'AppNavigator2', params: { foo: 'bar' } })],
      });
   

    // The navigateToScreen2 action is dispatched and new navigation state will be calculated in basicNavigationReducer here ---> https://gist.github.com/shubhnik/b55602633aaeb5919f6f3c15552d1802
    this.props.navigation.dispatch(resetAction)
}

  // getRatios = async () => {
  //   const ratios = await this.camera.getSupportedRatios();
  //   return ratios;
  // };

  // toggleView() {
  //   this.setState({
  //     showGallery: !this.state.showGallery,
  //   });
  // }

  // goBack = async () => {
  //   if ( Platform.OS === 'ios')
  //   {
  //   Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
  //   }
  //   this.navigateRoot();
   

  // }

  // toggleFacing() {
  //   this.setState({
  //     type: this.state.type === 'back' ? 'front' : 'back',
  //   });
  // }

  // toggleFlash() {
  //   this.setState({
  //     flash: flashModeOrder[this.state.flash],
  //   });
  // }

  // setRatio(ratio) {
  //   this.setState({
  //     ratio,
  //   });
  // }

  // toggleWB() {
  //   this.setState({
  //     whiteBalance: wbOrder[this.state.whiteBalance],
  //   });
  // }

  // toggleFocus() {
  //   this.setState({
  //     autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
  //   });
  // }

  // zoomOut() {
  //   this.setState({
  //     zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
  //   });
  // }

  // zoomIn() {
  //   this.setState({
  //     zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
  //   });
  // }

  // setFocusDepth(depth) {
  //   this.setState({
  //     depth,
  //   });
  // }

//   takePicture = async function() {
    
  
//     if (this.camera) {
//       console.log("Comienzo FOTO")
//   //   this.miuri = await this.camera.takePictureAsync({base64:true, quality: 0.3});
//      this.miuri = await this.camera.takePictureAsync( {quality: 0.3, exif: true});
//      console.log("SALE de FOTO")
//  //    this.props.actindicatorImageEnabled();
//    //  this.toggleView();
     
//      var d = new Date();
//      var n = d.getTime();
//       //   var utcDate = dt.toUTCString();
//       //   var res = utcDate.replace(' ','');  
//       console.log("salida de foto:" + JSON.stringify(this.miuri));
//          console.log("timestamp: "+n);
//       console.log("Foto recien sacada quality a 0.3 - width:"+ this.miuri.width + " height: "+this.miuri.height);
//      // response = await fetch(this.miuri.uri);
//       miuri2 = await FileSystem.moveAsync({
//                    from: this.miuri.uri,
//                    to: `${FileSystem.documentDirectory}photos/Photo_${n}.jpg`,
//               //     to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
//                 });



//       //           const info2 = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photos/Photo_44.jpg`);
//       //           console.log(`FILE MOVE: ${JSON.stringify(info2)}`);



//       // this.setState({
//       //   // uriresize: this.miuri.uri
//       //  // uriresize: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`
//       //  uriresize: `${FileSystem.documentDirectory}photos/Photo_${n}.jpg`
//       //  });


      
// //       this.camera.takePictureAsync().then(data => {
// //         FileSystem.moveAsync({
// //           from: data.uri,
// //           to: `${FileSystem.documentDirectory}photos/Photo_1.jpg`,
// //         }).then(() => {

// // //      to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,      
         
        
// //        //   Vibration.vibrate();


          
// //         });
// //       });

    
//       // const info2 = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photos/Photo_2.jpg`);
//       // console.log(`FILE 2 INFO2: ${JSON.stringify(info2)}`);
//       // const info3 = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photos/Photo_3.jpg`);
//       // console.log(`FILE 3 INFO3: ${JSON.stringify(info3)}`);

// //   { format: 'jpeg', compress: 1},


// if ( Platform.OS === 'ios')

// {  console.log("es funckin IOS");
// altura = 230;
//               }
//               else{console.log("es funckin ANDROID");
//               altura = 700; 
//             }

//     //   const { uri, width, height } = await ImageManipulator.manipulate(
//     //   //  `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
//     //     `${FileSystem.documentDirectory}photos/Photo_${n}.jpg`,
//     //     [{ resize: { height: 450 }}],
//     //   //  [ { resize: { height: 500 }} ],
//     //     { format: 'jpeg', compress: 0.90},
//     //   );

//     // }else{
//       const { uri, width, height } = await ImageManipulator.manipulate(
//         //  `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
//           `${FileSystem.documentDirectory}photos/Photo_${n}.jpg`,
//           [{ resize: { height: altura }}],
//      //     [{ resize: { height: altura }}, { rotate: -90}],
//         //  [ { resize: { height: 500 }} ],
//           { format: 'jpeg', compress: 0.90},
//         );

// //    }

//       // this.setState({
//       //   // uriresize: this.miuri.uri
//       //  // uriresize: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`
//       //  uriresize: uri
//       //  });

//       // this.setState({
//       //   // uriresize: this.miuri.uri
//       //   uriresize: uri
//       //  });

    



//       console.log("nueva resolucion IMGManipulator width: "+ width + " height: " + height);

//       const info1 = await FileSystem.getInfoAsync(uri);
//       console.log(`FILE INFO1: ${JSON.stringify(info1)}`);

//       this.setState({
//         photoId: this.state.photoId + 1,
//         uriresize: uri,
//         size: info1.size
//       });

//       // const info1 = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photos/Photo_1.jpg`);
//       // console.log(`FILE 1 INFO1: ${JSON.stringify(info1)}`);
//       // const infor = await FileSystem.getInfoAsync(uri);
   
   
//     //this.toggleView();
//     fileName2 = uri.replace(/^.*[\\\/]/, '');
//     envio = {name: fileName2, url: uri, type: 'image', sent: 'false', size: info1.size } 
    
    
    
//      vari2 = await this.props.sendActualMedia(envio);
//      console.log("Fin de espera larga ANDROID")
//      this.goBack();
     
//      if ( Platform.OS === 'ios')
//      timer = 1000;
//       else timer = 0;

//      setTimeout(() => {
//        console.log("hago esperar 1200ms para q siempre se abra el modal en qsoScreen");
//        this.props.actindicatorImageDisabled();
//         this.props.openModalConfirmPhoto();
//     }, 1000);

    
     


//       // console.log(`FILE 1 con RESIZE: ${JSON.stringify(infor)}`);



//     }
  
   
//   };

  // onFacesDetected = ({ faces }) => this.setState({ faces });
  // onFaceDetectionError = state => console.warn('Faces detection error:', state);

//   renderGallery() {
    
//   //  return <GalleryScreen onPress={this.toggleView.bind(this)} />;
//   //return <Muestro onPress={this.toggleView.bind(this)} imageurl={this.state.uriresize}/>;
//   //<View style={{ justifyContent: 'center', marginTop: 130}}>
//   // </View>
//   return  <Muestro onPress={this.toggleView.bind(this)} imageurl={this.state.uriresize}/>;
// // this.props.sqsoactivityindicatorImage
//  // return <ActivityIndicator  animating={true} size="large" color='orange' />;
      
//   }

  // renderFace({ bounds, faceID, rollAngle, yawAngle }) {
  //   return (
  //     <View
  //       key={faceID}
  //       transform={[
  //         { perspective: 600 },
  //         { rotateZ: `${rollAngle.toFixed(0)}deg` },
  //         { rotateY: `${yawAngle.toFixed(0)}deg` },
  //       ]}
  //       style={[
  //         styles.face,
  //         {
  //           ...bounds.size,
  //           left: bounds.origin.x,
  //           top: bounds.origin.y,
  //         },
  //       ]}>
  //       <Text style={styles.faceText}>ID: {faceID}</Text>
  //       <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
  //       <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
  //     </View>
  //   );
  // }

  // renderLandmarksOfFace(face) {
  //   const renderLandmark = position =>
  //     position && (
  //       <View
  //         style={[
  //           styles.landmark,
  //           {
  //             left: position.x - landmarkSize / 2,
  //             top: position.y - landmarkSize / 2,
  //           },
  //         ]}
  //       />
  //     );
  //   return (
  //     <View key={`landmarks-${face.faceID}`}>
  //       {renderLandmark(face.leftEyePosition)}
  //       {renderLandmark(face.rightEyePosition)}
  //       {renderLandmark(face.leftEarPosition)}
  //       {renderLandmark(face.rightEarPosition)}
  //       {renderLandmark(face.leftCheekPosition)}
  //       {renderLandmark(face.rightCheekPosition)}
  //       {renderLandmark(face.leftMouthPosition)}
  //       {renderLandmark(face.mouthPosition)}
  //       {renderLandmark(face.rightMouthPosition)}
  //       {renderLandmark(face.noseBasePosition)}
  //       {renderLandmark(face.bottomMouthPosition)}
  //     </View>
  //   );
  // }

  // renderFaces() {
  //   return (
  //     <View style={styles.facesContainer} pointerEvents="none">
  //       {this.state.faces.map(this.renderFace)}
  //     </View>
  //   );
  // }

  // renderLandmarks() {
  //   return (
  //     <View style={styles.facesContainer} pointerEvents="none">
  //       {this.state.faces.map(this.renderLandmarksOfFace)}
  //     </View>
  //   );
  // }

  // renderNoPermissions() {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
  //       <Text style={{ color: 'white' }}>
  //         Camera permissions not granted - cannot open camera preview.
  //       </Text>
  //     </View>
  //   );
  // }

//   renderCamera() {
  //   return (

  //    <Camera
  //       ref={ref => {
  //         this.camera = ref;
  //       }}
  //       style={{
  //         flex: 1,
  //       }}
  //      // useCamera2Api={true}
  //       type={this.state.type}
  //       flashMode={this.state.flash}
  //       autoFocus={this.state.autoFocus}
  //       zoom={this.state.zoom}
  //       whiteBalance={this.state.whiteBalance}
  //       ratio={this.state.ratio}
  //       faceDetectionLandmarks={Camera.Constants.FaceDetection.Landmarks.all}
  //       onFacesDetected={this.onFacesDetected}
  //       onFaceDetectionError={this.onFaceDetectionError}
  //       focusDepth={this.state.depth}>

  //       {/* <View style={{ justifyContent: 'center', marginTop: 130}}>
  //     <ActivityIndicator  animating={this.props.sqsoactivityindicatorImage} size="large" color='orange' />
  //          </View> */}

  //       <View
  //         style={{
  //           flex: 0.5,
  //           backgroundColor: 'transparent',
  //           flexDirection: 'row',
  //           justifyContent: 'space-around',
  //           paddingTop: Constants.statusBarHeight / 2,
  //         }}>
  //         {/* <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
  //         <ActivityIndicator  animating={this.props.sqsoactivityindicatorImage} size="large" color='orange' />
  //         </TouchableOpacity> */}

  //         <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
  //           <Text style={styles.flipText}> FLIP </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
  //           <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
  //           <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
  //         </TouchableOpacity>
  //       </View>
  //       <View
  //         style={{
  //           flex: 0.4,
  //           backgroundColor: 'transparent',
  //           flexDirection: 'row',
  //           alignSelf: 'flex-end',
  //           marginBottom: -5,
  //         }}>
  //         {this.state.autoFocus !== 'on' ? (
  //           <Slider
  //             style={{ width: 150, marginTop: 15, marginRight: 15, alignSelf: 'flex-end' }}
  //             onValueChange={this.setFocusDepth.bind(this)}
  //             step={0.1}
  //           />
  //         ) : null}
  //       </View>
  //       <View
  //         style={{
  //           flex: 0.1,
  //           paddingBottom: isIPhoneX ? 20 : 0,
  //           backgroundColor: 'transparent',
  //           flexDirection: 'row',
  //           alignSelf: 'flex-end',
  //         }}>
  //         <TouchableOpacity
  //           style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
  //           onPress={this.zoomIn.bind(this)}>
  //           <Text style={styles.flipText}> + </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
  //           onPress={this.zoomOut.bind(this)}>
  //           <Text style={styles.flipText}> - </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
  //           onPress={this.toggleFocus.bind(this)}>
  //           <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
  //           onPress={this.takePicture.bind(this)}>
  //           <Text style={styles.flipText}> SNAP </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: 'flex-end' }]}
  //           onPress={this.toggleView.bind(this)}>
  //           <Text style={styles.flipText}> Gallery </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: 'flex-end' }]}
  //           onPress={() => this.goBack()}>
  //           <Text style={styles.flipText}> Back </Text>
  //         </TouchableOpacity>
         
  //       </View>
  //       {this.renderFaces()}
  //       {this.renderLandmarks()}
  //     </Camera>
  //   );
  // }

  render() { console.log("camera render permission");
  //  const cameraScreenContent = this.state.permissionsGranted
  // const cameraScreenContent = this.props.sqsocamerapermission
  //     ? this.renderCamera()
  //     : this.renderNoPermissions();
  //   const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent;
 //   return <View style={styles.container}>{content}</View>;
 return <View style={styles.container}>
    
            <Text style={styles.flipText}> Hola Camera </Text>
     
 
 </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  galleryButton: {
    backgroundColor: 'indianred',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
});



const mapStateToProps = state => {
  return { 
    sqsoactivityindicatorImage: state.sqso.currentQso.activityindicatorImage,
    sqsocamerapermission: state.sqso.camerapermission
   // camerapermission: state.sqso.camerapermission
      };
};

// return {  isTransitioning: state.nav.isTransitioning,
//   index: state.nav.routes[0].index,
//   sqso: state.sqso };
// };


const mapDispatchToProps = {
  
  openModalConfirmPhoto,
  sendActualMedia,
  actindicatorImageDisabled,
  actindicatorImageEnabled
 }

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);