import {FETCHING_API_REQUEST,
        FETCHING_API_SUCCESS,
        FETCHING_API_FAILURE,
        SET_BAND,
        SET_MODE, ADD_QRA, ADD_MEDIA, CLOSE_MODALCONFIRM_PHOTO,
        OPEN_MODALCONFIRM_PHOTO, SEND_ACTUAL_MEDIA,
        ACT_INDICATOR_IMAGE_ENABLED,
        CAMERA_PERMISSION_FALSE,
        CAMERA_PERMISSION_TRUE, AUDIO_RECORDING_PERMISSION_TRUE,
        AUDIO_RECORDING_PERMISSION_FALSE,
        NEW_QSO_ACTIVE_TRUE, NEW_QSO_ACTIVE_FALSE,
        CHANGE_QSO_TYPE, ON_PROGRESS_TRUE, ON_PROGRESS_FALSE,
        UPDATE_QRA_URL, SET_QRA, QSO_SENT_UPDATES_AND_SQLRDSID,
        UPDATE_QSOQRA_SENT_STATUS, UPDATE_ONLYONE_QSOQRA_SENT_STATUS,
        UPDATE_QSO_HEADER_STATUS, RESET_QSO, 
        UPDATE_MEDIA, CLOSE_MODAL_RECORDING, OPEN_MODAL_RECORDING,
        ACT_INDICATOR_POST_QSO_NEW_TRUE, ACT_INDICATOR_POST_QSO_NEW_FALSE,
        QSO_QRA_DELETE, SET_URL_RDS_S3, INSERT_FOLLOWINGS, INSERT_FOLLOWERS,
        FOLLOWERS_ALREADY_CALLED, FOLLOWINGS_SELECTED, QRA_SEARCH,
        UPDATE_QSL_SCAN, UPDATE_QSL_SCAN_RESULT,
        REFRESH_FOLLOWINGS, QRA_SEARCH_LOCAL, PROFILE_PICTURE_REFRESH,
        SET_LOCATION  } from './types';

import awsconfig from '../aws-exports';
import Amplify, { Auth, API, Storage } from 'aws-amplify';
import { NetInfo, Platform } from 'react-native';
import { getDateQslScan } from '../helper';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';

Amplify.configure(awsconfig)

export const fetchingApiRequest = () => {
    return {
        type: FETCHING_API_REQUEST
    };
}
export const fetchingApiSuccess = (json) => {
    return {
        type: FETCHING_API_SUCCESS,
        payload: json
    };
}
export const fetchingApiFailure = (error) => {
    return {
        type: FETCHING_API_FAILURE,
        payload: error
    };
}
export const cambioqsotype = (typetochange) => {
    return {
        type: CHANGE_QSO_TYPE,
        typetochange: typetochange 
    };
}
export const setBand = (band) => {
    return {
        type: SET_BAND,
        band: band
    };
}
export const setMode = (mode) => {
    return {
        type: SET_MODE,
        mode: mode
    };
}

export const profilePictureRefresh = () => {
    return {
        type: PROFILE_PICTURE_REFRESH
       
    };
}

export const addQra = (newqra) => {
    return {
        type: ADD_QRA,
        newqra: newqra
    };
}

export const updateQraUrl = (qra,url) => {
    return {
        type: UPDATE_QRA_URL,
        qra: qra,
        url: url
    };
}

// export const fetchPeople = () => {
//   return async dispatch => {
//     dispatch(fetchingPeopleRequest());
//     try {
//         console.log("ejecuta llamada API");
//         let response = await fetch("https://randomuser.me/api/?results=10");
//         let json = await response.json();
//         dispatch(fetchingPeopleSuccess(json.results));
//      } catch (error){
//          dispatch(fetchingPeopleFailure(error));
//      }
//   };
// };

export const addMedia = (newmedia) => {
    return {
        type: ADD_MEDIA,
        newmedia: newmedia
    };
}

export const closeModalConfirmPhoto = (phototype) => {
    return {
        type: CLOSE_MODALCONFIRM_PHOTO,   
        phototype: phototype
            
    };
}

export const closeModalRecording = () => {
    return {
        type: CLOSE_MODAL_RECORDING       
    };
}

export const openModalRecording = () => {
    return {
        type: OPEN_MODAL_RECORDING       
    };
}

export const openModalConfirmPhoto = (height) => {
    return {
        type: OPEN_MODALCONFIRM_PHOTO, 
        height: height      
    };
}

export const sendActualMedia = (media) => {
    return {
        type: SEND_ACTUAL_MEDIA,       
        mediatosend: media
    };
}

export const actindicatorImageEnabled = () => {
    return {
        type: ACT_INDICATOR_IMAGE_ENABLED       
       
    };
}

export const cameraPermissionTrue = () => {
    return {
        type: CAMERA_PERMISSION_TRUE       
       
    };
}

export const cameraPermissionFalse = () => {
    return {
        type: CAMERA_PERMISSION_FALSE       
       
    };
}


export const audiorecordingPermissionTrue = () => {
    return {
        type: AUDIO_RECORDING_PERMISSION_TRUE       
       
    };
}

export const audiorecordingPermissionFalse = () => {
    return {
        type: AUDIO_RECORDING_PERMISSION_FALSE      
       
    };
}

export const newqsoactiveTrue = () => {
    return {
        type: NEW_QSO_ACTIVE_TRUE       
       
    };
}

export const newqsoactiveFalse = () => {
    return {
        type: NEW_QSO_ACTIVE_FALSE       
       
    };
}

export const actindicatorPostQsoNewTrue = () => {
    return {
        type: ACT_INDICATOR_POST_QSO_NEW_TRUE       
       
    };
}

export const actindicatorPostQsoNewFalse = () => {
    return {
        type: ACT_INDICATOR_POST_QSO_NEW_FALSE      
       
    };
}


export const onprogressTrue = () => {
    return {
        type: ON_PROGRESS_TRUE       
       
    };
}

export const onprogressFalse = () => {
    return {
        type: ON_PROGRESS_FALSE
       
    };
}


export const fetchQraProfileUrl = (qra) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API URL PROFILE");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qra-get-profile-pic';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
            "qra": qra
          }
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api URL!");
      //console.log("respuesta API:" + JSON.stringify(respuesta));
      console.log("respuesta API url:" + JSON.stringify(respuesta));
      url = {"url": respuesta.message.url, "following": respuesta.message.following} 
    //   console.log("la url que envio:" + url);
    //   console.log("EL QRA:" + qra);
      dispatch(fetchingApiSuccess(respuesta.results));
      dispatch(updateQraUrl(qra,url));
      
    }
    catch (error) {
      console.log('Api catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };

  export const setQra = (qra) => {
    return {
        type: SET_QRA,
        qra: qra
    };
}

export const setLocation = (lat,lon) => {
    return {
        type: SET_LOCATION,
        lat: lat,
        lon: lon
    };
}


export const updateQsoStatusSentAndSqlRdsId = (sqlrdsid,typestatus, bandstatus, modestatus) => {
    return {
        type: QSO_SENT_UPDATES_AND_SQLRDSID,
        sqlrdsid: sqlrdsid,
        typestatus: typestatus,
        bandstatus: bandstatus,
        modestatus: modestatus
    };
}

export const postQsoNew = (bodyqsonew,qsoqras) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API Qso NEW");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qsonew';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: bodyqsonew
          
        }


      respuesta =  await API.post(apiName, path, myInit);
      console.log("llamo api QsoNEW!");
    
      console.log("EL QSO Number es:" + respuesta.message);
      dispatch(fetchingApiSuccess(respuesta));
     
      if (respuesta.error==='0')
      {

      //  dispatch(actindicatorPostQsoNewFalse());
       
        console.log("error es 0 y sqlrdsid: "+respuesta.message);
      if (bodyqsonew.type==='POST')
         dispatch(updateQsoStatusSentAndSqlRdsId (respuesta.message,true,false,false));
      else
        dispatch(updateQsoStatusSentAndSqlRdsId (respuesta.message,true,true,true));
        await dispatch(postQsoQras("ALL",respuesta.message, qsoqras));

      }

      dispatch(actindicatorPostQsoNewFalse());
     
    }
    catch (error) {
      console.log('Api catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };

  export const postQsoQras = (type, sqlRdsId, qsoqras) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API POSTqsoQRAS");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        var arr = [];
        var reformattedArray = qsoqras.map(function(obj){ 
            
           // rObj[obj.clave] = obj.valor;
           arr.push(obj.qra);
            
         });

         console.log("SIN FORMATEAR: "+ JSON.stringify(qsoqras));
         console.log("reformateado: "+ JSON.stringify(arr));

        let apiName = 'superqso';
        let path = '/qsoqraadd';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {"qso": sqlRdsId,
                "qras": arr                }
          
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api! QSO_QRA_ADD");
    
     // console.log("EL QSO Number es:" + respuesta.message);
      dispatch(fetchingApiSuccess(respuesta));
     
      if (respuesta.error==='0')
      {
       // dispatch(updateSqlRdsId(respuesta.message));
        console.log("error es 0 y SALIDA de QsoQraADD: "+JSON.stringify(respuesta.message));
      //  console.log("FOLLOWING: "+respuesta.message[0].following )

        if (type==='ALL')
        {
        // actualizo el status de todos los QRAs del QSO como SENT ya que fue enviado a AWS
        console.log("actualizo TODOS los QRAs");
        status = {"sent": true}
        dispatch(updateQsoQraStatus(status));
        }else 
        { // Actualizo solo el QRA que se envio, que es uno solo
            console.log("actualizo solo un QRA");
            status = {"sent": true}
            dispatch(updateQsoOnlyOneQraStatus(status, arr[0]));
        }

      }
     
    }
    catch (error) {
      console.log('Api catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };

  export const updateQsoQraStatus = (status) => {
    return {
        type: UPDATE_QSOQRA_SENT_STATUS,
        sentStatus: status
    };
}

export const updateQsoOnlyOneQraStatus = (status, qra) => {
    return {
        type: UPDATE_ONLYONE_QSOQRA_SENT_STATUS,
        sentStatus: status,
        qra: qra
    };
}

export const postQsoEdit = (qsoHeader) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API QsoEdit");  
    try {
        session = await Auth.currentSession();
      //  console.log("Su token es: " + session.idToken.jwtToken);
  

         console.log("SIN FORMATEAR: "+ JSON.stringify(qsoHeader));
     

        let apiName = 'superqso';
        let path = '/qsoedit';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
                "mode": qsoHeader.mode,
                "band": qsoHeader.band,
                "qso": qsoHeader.sqlrdsid,
                "type": qsoHeader.type               }
          
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api! QSO_EDIT");
    
     
      dispatch(fetchingApiSuccess(respuesta));
     
      if (respuesta.error==='0')
      {
       // dispatch(updateSqlRdsId(respuesta.message));
        console.log("error es 0 y SALIDA de QsoEDITQ: "+JSON.stringify(respuesta.message));

       
        // actualizo el status de todos los QRAs del QSO como SENT ya que fue enviado a AWS
        console.log("actualizo el QsoHeaderStatus");
        
        dispatch(updateQsoHeaderStatusTrue());
        

      }
     
    }
    catch (error) {
      console.log('Api catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };


  export const updateQsoHeaderStatusTrue = () => {
    return {
        type: UPDATE_QSO_HEADER_STATUS
    };
}

export const resetQso = () => {
    return {
        type: RESET_QSO
    };
}

export const updateMediaStatus = (filename,status) => {
    return {
        type: UPDATE_MEDIA_STATUS,
        filename: filename,
        status: status
    };
}

export const updateMedia = (filename,update) => {
    return {
        type: UPDATE_MEDIA,
        filename: filename,
        update: update
    };
}

export const deleteQsoQra = (qra) => {
    return {
        type: QSO_QRA_DELETE,
        qra: qra
    };
}


export const postSetProfilePic = (url, filename2) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API SetProfilePic");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qra-set-profile-pic';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
            "url":  url
               }
          
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api SetProfilePic!");
    
      
      dispatch(fetchingApiSuccess(respuesta));
      console.log("devuelve SetProfilePic: "+JSON.stringify(respuesta));
     
      if (respuesta.error==='0')
      {
       // dispatch(updateSqlRdsId(respuesta.message));
        console.log("error es 0 y sqlrdsid: "+respuesta.message);

      //  update = {"status": "sent", "progress": 1}
      update = {"status": 'sent', "progress": 1}
        dispatch(updateMedia(filename2, update));
        dispatch(profilePictureRefresh());
        // stat = {"sent": true, "progress": 0.8}
        // this.props.updateMediaSent(fileName2,stat);

      }else
      {
        update = {status: 'failed'}
        dispatch(updateMedia(filename2, update ));
      }
     
    }
    catch (error) {
      console.log('Api catch error:', error);
      update = {status: 'failed'}
      dispatch(updateMedia(filename2, update ));
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };



export const postAddMedia = (mediaToadd, filename2) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API Add Media");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qsomediaadd';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: mediaToadd
          
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api MediaAdd!");
    
      
      dispatch(fetchingApiSuccess(respuesta));
      console.log("devuelve addmedia: "+JSON.stringify(respuesta));
     
      if (respuesta.body.error===0)
      {
       // dispatch(updateSqlRdsId(respuesta.message));
        console.log("error es 0 y sqlrdsid: "+respuesta.message);

      //  update = {"status": "sent", "progress": 1}
      update = {"status": 'sent', "progress": 1}
        dispatch(updateMedia(filename2, update));
        // stat = {"sent": true, "progress": 0.8}
        // this.props.updateMediaSent(fileName2,stat);

      }else
      {
        update = {status: 'failed'}
        dispatch(updateMedia(filename2, update ));
      }
     
    }
    catch (error) {
      console.log('Api catch error:', error);
      update = {status: 'failed'}
      dispatch(updateMedia(filename2, update ));
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };



export const uploadMediaToS3 = (fileName2, fileaux, sqlrdsid, description, size, type, rdsUrlS3, date, width, height) => {
    return async dispatch => {
    //  dispatch(fetchingApiRequest());
      console.log("ejecuta UPLOAD a S3 desde ACTION");  
    try {

        // const response = await fetch(fileaux);
        // const blobi = await response.blob();

     //agrego native
        let fileauxFinal = fileaux;
        if (Platform.OS == 'ios')
        {
          fileauxFinal =  fileaux.replace("file:///", '');
        }
        console.log('contenido fileauxFinal: '+fileauxFinal);

           if (type==='image') folder = 'images/'+fileName2;
          else folder = 'audios/'+fileName2;
          

          if (type==='profile') folder = 'profile/profile.jpg';
      
        console.log('folder:'+ folder);
   

//, contentType: 'image/png'
         enBlob = RNFetchBlob.fs.readFile(fileauxFinal, 'base64').then(data => new Buffer(data, 'base64'));
      //   return this.readFile(fileauxFinal)
         enBlob
         .then(buffer => Storage.vault.put(folder, buffer, { level: 'protected' }))
         .then (result => {
                  console.log('resultado:'+result.key);


                // actualizo SENT como TRUE en mediafile para ese file.
                update = {"sent": true, "progress": 0.8}
                dispatch(updateMedia(fileName2,update));
    
                // procedo a llamar API de addmedia al RDS
                mediaToRds = {
                  "qso":  sqlrdsid,
                  "type": type ,
                  "datasize": size,
                  "datetime": date,   
                  "width": width,
                  "height": height,   
                  "url":  rdsUrlS3,
                  "description": description 
              }
           if (type !== 'profile')
           {
              dispatch(postAddMedia(mediaToRds, fileName2));
              console.log("LLLLLLLLLLL LLamo recien a media: "+ fileName2);
           }else
           {
            dispatch(postSetProfilePic(rdsUrlS3, fileName2));
            console.log("LLLLLLLLLLL LLamo recien a postSetProfilePic: "+ fileName2);
            
           }

    
    
              
    
                
                })
                .catch(err => {
                  console.log(JSON.stringify(err));
                  console.log("fallo el UPLOAD UPLOAD UPLOADS3");
                  console.log("nombre filename:" + fileName2);
              
                  update = {"status": 'failed'}
                  dispatch(updateMedia(fileName2,update));
                        
                });















        
        // if (type==='image') folder = 'images/';
        //   else folder = 'audios/';
      
        // console.log('folder:'+ folder+fileName2);

        // const stored = Storage.vault.put(folder+fileName2, blobi, {
        //     level: 'protected'})
        //       .then (result => {
        //         console.log(result);



        //         // actualizo SENT como TRUE en mediafile para ese file.
        //         update = {"sent": true, "progress": 0.8}
        //         dispatch(updateMedia(fileName2,update));
    
        //         // procedo a llamar API de addmedia al RDS
        //         mediaToRds = {
        //           "qso":  sqlrdsid,
        //           "type": type ,
        //           "datasize": size,
        //           "datetime": date,      
        //           "url":  rdsUrlS3,
        //           "description": description 
        //       }
    
        //       dispatch(postAddMedia(mediaToRds, fileName2));
        //       console.log("LLLLLLLLLLL LLamo recien a media: "+ fileName2);
    
    
              
        //       })
        //       .catch(err => {
        //         console.log(JSON.stringify(err));
        //         console.log("fallo el UPLOAD UPLOAD UPLOADS3");
        //         console.log("nombre filename:" + fileName2);
              
        //         update = {"status": 'failed'}
        //         dispatch(updateMedia(fileName2,update));
              
              
              
        //       });
              
    }
    catch (error) {
      console.log('Api UPLOAD S3 catch error:', error);
      //dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };




export const QsoQraDelete = (sqlrdsid, qra) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API QsoQraDELETE");  
    try {
        session = await Auth.currentSession();
      //  console.log("Su token es: " + session.idToken.jwtToken);
  

    //     console.log("SIN FORMATEAR: "+ JSON.stringify(qsoHeader));
     

        let apiName = 'superqso';
        let path = '/qsoqradel';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
            "qso":  sqlrdsid ,
            "qras": [qra]    
               }
          
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api! QsoQraDELETE");
    
     
      dispatch(fetchingApiSuccess(respuesta));
     
      if (respuesta.error==='0')
      {
       // dispatch(updateSqlRdsId(respuesta.message));
        console.log("error es 0 y SALIDA de QsoQraDELETE: "+JSON.stringify(respuesta.message));


       
        // actualizo el status de todos los QRAs del QSO como SENT ya que fue enviado a AWS
        console.log("actualizo el QsoQras");
        
        dispatch(deleteQsoQra(qra));
        

      }
     
    }
    catch (error) {
      console.log('Api catch DELETE_QSO_QRA error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };

  export const setUrlRdsS3 = (urlrds) => {
    return {
        type: SET_URL_RDS_S3,
        urlrds: urlrds
    };
}

export const followAdd = (qra, date) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API URL PROFILE");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qra-follower';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
            "qra": qra,
            "datetime": date
          }
        }


      respuesta = await API.post(apiName, path, myInit);
      console.log("llamo api Follow ADD!");
      //console.log("respuesta API:" + JSON.stringify(respuesta));
      console.log("respuesta API Follow Add:" + JSON.stringify(respuesta.body.message));
      console.log("FOLLOW ANTES de ENTRAR porque ERROR === 0 " + respuesta.body.error);
      if (respuesta.body.error===0)
      {
        console.log("FOLLOW entro porque ERROR === 0 " + respuesta.body.error);
      following = {"following": 'TRUE'} 
      dispatch(updateQraUrl(qra,following));
      dispatch(insertFollowings(respuesta.body.message));
     
    //   console.log("la url que envio:" + url);
    //   console.log("EL QRA:" + qra);
      }
      dispatch(fetchingApiSuccess(respuesta));
      
      
    }
    catch (error) {
      console.log('Api catch error Follow ADD:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };


  export const unfollow= (qra) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API UnFollow");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qra-follower';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
          body: {
            "qra": qra
            
          }
        }


      respuesta = await API.del(apiName, path, myInit);
      console.log("llamo api Follow ADD!");
      //console.log("respuesta API:" + JSON.stringify(respuesta));
      console.log("respuesta API UnFollow Add:" + JSON.stringify(respuesta.body.message));
      console.log("unFOLLOW ANTES de ENTRAR porque ERROR === 0 " + respuesta.body.error);
      if (respuesta.body.error===0)
      {
        console.log("unFOLLOW entro porque ERROR === 0 " + respuesta.body.error);
      following = {"following": 'FALSE'} 
      dispatch(updateQraUrl(qra,following));
      dispatch(insertFollowings(respuesta.body.message));
    
      }
      dispatch(fetchingApiSuccess(respuesta));
      
      
    }
    catch (error) {
      console.log('Api catch error unFollow :', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }
         
      
    };
  };

  export const getFollowingFollowers = () => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API getFollowingFollowers");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/user-info';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          }, // OPTIONAL
        //   body: {
           
        //   }
        }

        
      respuesta = await API.get(apiName, path, myInit);
      console.log("llamo api getFollowingFollowers");
      //console.log("respuesta API:" + JSON.stringify(respuesta));
      console.log("respuesta API getFollowingFollowers:" + JSON.stringify(respuesta));
      followings = respuesta.body.message.followings;
      followers = respuesta.body.message.followers;
    //   console.log("la url que envio:" + url);
    //   console.log("EL QRA:" + qra);
      dispatch(fetchingApiSuccess(respuesta));
    //  dispatch(insertFollowingsFollowers(followings,followers));
        dispatch(insertFollowings(followings));
        dispatch(insertFollowers(followers));

      
    }
    catch (error) {
      console.log('Api getFollowingFollowers catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }    
    };
  };

//   export const insertFollowingsFollowers = (followings,followers) => {
//     return {
//         type: INSERT_FOLLOWINGS_FOLLOWERS,
//         followings: followings,
//         followers: followers
//     };
// }

export const insertFollowings = (followings) => {
    return {
        type: INSERT_FOLLOWINGS,
        followings: followings
        
    };
}
export const insertFollowers = (followers) => {
    return {
        type: INSERT_FOLLOWERS,      
        followers: followers
    };
}

export const followersAlreadyCalled = (status) => {
    return {
        type: FOLLOWERS_ALREADY_CALLED,
        status: status
    };
}

export const followingsSelected = (selected) => {
    return {
        type: FOLLOWINGS_SELECTED,
        selected: selected
    };
}

export const insertQraSearched = (qras) => {
    return {
        type: QRA_SEARCH,
        qras: qras
    };
}



export const getQrasFromSearch = (qraTosearch) => {
    return async dispatch => {
      dispatch(fetchingApiRequest());
      console.log("ejecuta llamada API getQrasFromSearch");  
    try {
        session = await Auth.currentSession();
        console.log("Su token es: " + session.idToken.jwtToken);
        let apiName = 'superqso';
        let path = '/qra-list-secured';
        let myInit = { // OPTIONAL
          headers: {
            'Authorization': session.idToken.jwtToken,
            'Content-Type': 'application/json'
          },
          body: {
            "qra": qraTosearch
            
          }
        }

      
       
      respuesta = await API.post(apiName, path, myInit);
      if (respuesta.error===0)
      {
            console.log("respuesta API getQrasFromSearch:" + JSON.stringify(respuesta));
                  
            dispatch(insertQraSearched(respuesta.message));
      }else{
           envio = [];
           dispatch(insertQraSearched(envio));
        }
 
      dispatch(fetchingApiSuccess(respuesta));
      
    }
    catch (error) {
      console.log('Api getQrasFromSearch catch error:', error);
      dispatch(fetchingApiFailure(error));
      // Handle exceptions
    }    
    };
  };


  export const checkInternet = () => {
    return async dispatch => {
       let res = await NetInfo.getConnectionInfo().then((connectionInfo) => { 
           console.log('devuelve NetInfo:'+connectionInfo.type); 
           salida = true;
          if (connectionInfo.type==='none'){
              console.log('paso por NO hay wifi');
              salida = false;}


       })
       return salida;

      };          
    };

    export const getQslScan = (QsoTosearch) => {
        return async dispatch => {
          dispatch(fetchingApiRequest());
          console.log("ejecuta llamada API getQSL SCAN");  
        try {
            session = await Auth.currentSession();
            console.log("Su token es: " + session.idToken.jwtToken);
            let apiName = 'superqso';
            let path = '/qso-detail-qr';
            let myInit = { // OPTIONAL
              headers: {
               'Authorization': session.idToken.jwtToken,
                'Content-Type': 'application/json'
              },
              body: {
                "qso": QsoTosearch
                
              }
            }
    
          
           
          respuesta = await API.post(apiName, path, myInit);
            
            // {
                console.log("respuesta API getQSL SCAN:" + JSON.stringify(respuesta));
                if (respuesta.body.error===0)
                    respuesta.body.message.datetime = getDateQslScan(respuesta.body.message.datetime);
            
                    console.log("respuesta DESPUES DE MODIF FECHA:" + JSON.stringify(respuesta));
               
                     
                dispatch(updateQslScan(respuesta));
            

            //  }
            //  else {
            //     dispatch(updateQslScan(respuesta));
            //  }
            //     console.log("respuesta API getQSL NO ENCONTRO:" + JSON.stringify(respuesta));
            //     respuesta = {
            //         statusCode: 200,
            //         headers: {
                       
            //         },
            //         body: {   
            //              error: 1,
            //              message: {  }
            //                 }
            //              }
            //              dispatch(updateQslScan(respuesta));
                 



            // }
          
    
          dispatch(fetchingApiSuccess(respuesta));
          
        }
        catch (error) {
          console.log('Api get QSL Scan catch error:', error);
          dispatch(fetchingApiFailure(error));
          // Handle exceptions
        }    
        };
      };
    

      export const updateQslScan = (qslresult) => {
        return {
            type: UPDATE_QSL_SCAN,
            qslresult: qslresult
        };
    }

    export const updateQslScanResult = (result) => {
        return {
            type: UPDATE_QSL_SCAN_RESULT,
            result: result
        };
    }

    
    export const refreshFollowings = (status) => {
        return {
            type: REFRESH_FOLLOWINGS,
            status: status
        };
    }
    
    export const searchQrasLocal = (qratosearch,count) => {
        return {
            type: QRA_SEARCH_LOCAL,
            qratosearch: qratosearch,
            count: count
        };
    }