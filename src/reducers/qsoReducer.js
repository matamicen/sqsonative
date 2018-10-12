import {FETCHING_API_REQUEST,
    FETCHING_API_SUCCESS,
    FETCHING_API_FAILURE,
    SET_BAND, SET_MODE, ADD_QRA, ADD_MEDIA, CLOSE_MODALCONFIRM_PHOTO,
    OPEN_MODALCONFIRM_PHOTO, SEND_ACTUAL_MEDIA,
    ACT_INDICATOR_IMAGE_ENABLED, CAMERA_PERMISSION_TRUE,
    CAMERA_PERMISSION_FALSE, AUDIO_RECORDING_PERMISSION_TRUE,
    AUDIO_RECORDING_PERMISSION_FALSE, NEW_QSO_ACTIVE_TRUE, NEW_QSO_ACTIVE_FALSE,
    CHANGE_QSO_TYPE, ON_PROGRESS_TRUE, ON_PROGRESS_FALSE, UPDATE_QRA_URL, SET_QRA,
    QSO_SENT_UPDATES_AND_SQLRDSID, UPDATE_QSOQRA_SENT_STATUS,
    UPDATE_ONLYONE_QSOQRA_SENT_STATUS, UPDATE_QSO_HEADER_STATUS, RESET_QSO,
    UPDATE_MEDIA,
    CLOSE_MODAL_RECORDING, OPEN_MODAL_RECORDING,
    ACT_INDICATOR_POST_QSO_NEW_FALSE, ACT_INDICATOR_POST_QSO_NEW_TRUE,
    QSO_QRA_DELETE, SET_URL_RDS_S3, INSERT_FOLLOWINGS, INSERT_FOLLOWERS, 
    FOLLOWERS_ALREADY_CALLED,
    FOLLOWINGS_SELECTED, QRA_SEARCH, UPDATE_QSL_SCAN, REFRESH_FOLLOWINGS, QRA_SEARCH_LOCAL,
    PROFILE_PICTURE_REFRESH, SET_LOCATION, SET_STOPALLAUDIOS } from '../actions/types';

const initialState = {
    qra: '',
    isFetching: false,
    errorApiMessage: '',
    apiSuccessMessage: '',
    camerapermission: false,
    audiorecordingpermission: false,
    newqsoactive: false,
    urlRdsS3: '',
    profilePicRefresh: new Date().getTime(),
    profileUrlCondition: true,
    stopAllAudios: false,
    currentQso: {
        
        sqlrdsId: '',
        onProgress: false,
        datetime: '',
  //      qsoqras: [{name: 'LU8AJ', url: 'https://randomuser.me/api/portraits/thumb/men/81.jpg'},
   //               {name: 'LW5AAA', url: 'https://randomuser.me/api/portraits/med/men/72.jpg'}],
        qsoqras: [],
        qsotype: 'QSO',
        qsotypeSent: false,
        band: 'Band',
        bandSent: false,
        mode: 'Mode',
        modeSent: false,
        mediafiles: [],
        modalconfirmphoto: false,
        phototype: '',
        modalconfirmphotoHeight: 0,
        modalrecording: false,
        mediatosend: {},
        activityindicatorImage: false,
        activityindicatorPostQsoNew: false,
        qraDeleted: false,
        followings: [],
        followers: [],
        followersAlreadyCalled: false,
        followingsSelected: true,
        qraSearched: [],
        qraShow: [],
        qslscan: {
            "statusCode": 200,
            "headers": {
               
            },
            "body": {   
                 "error": 5,
                 "message": {  }
                    }
                 },
        refreshFollowings: false,
        latitude: 0,
        longitude: 0
            


             }
    
}

const qsoReducer = (state = initialState, action) => {
    let newStore;
    let auxcurrentQso;
     switch(action.type) {
         case FETCHING_API_REQUEST:
           return {...state, isFetching: true };
         case FETCHING_API_FAILURE:
          return {...state, isFetching: false, errorApiMessage: action.payload  };
         case FETCHING_API_SUCCESS:
          return {...state, isFetching: false, apiSuccessMessage: action.payload };

          case CHANGE_QSO_TYPE:
         auxcurrentQso = {
            ...state.currentQso,
            qsotype: action.typetochange           
        };
        newStore = Object.assign({}, state,
            {
                ...state,
                currentQso: auxcurrentQso
            });
        return newStore;

        case SET_BAND:
        auxcurrentQso = {
           ...state.currentQso,
           band: action.band,
           bandSent: false           
       };
       newStore = Object.assign({}, state,
           {
               ...state,
               currentQso: auxcurrentQso
           });
       return newStore;

       case SET_MODE:
       auxcurrentQso = {
          ...state.currentQso,
          mode: action.mode,
          modeSent: false           
      };
      newStore = Object.assign({}, state,
          {
              ...state,
              currentQso: auxcurrentQso
          });
      return newStore;

      case ADD_QRA:
      console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
      auxcurrentQso = {
         ...state.currentQso,
         qsoqras: [...state.currentQso.qsoqras, action.newqra]           
     };
     newStore = Object.assign({}, state,
         {
             ...state,
             currentQso: auxcurrentQso
         });
     return newStore; 

     case QSO_QRA_DELETE:
     
     arrqras = state.currentQso.qsoqras;
   
     console.log("REDUCER QRA enviado array antesde borrar: "+action.qra + JSON.stringify(arrqras));
     arrayQraFinal =  deleteSingleQra(arrqras, action.qra);


        function deleteSingleQra(arr, qratodelete){
            return arr.filter (arr => {
                return arr.qra !== qratodelete
            })
        }

        console.log("REDUCER QRA enviado array DESPUES de borrar: "+action.qra + JSON.stringify(arrayQraFinal));

     auxcurrentQso = {
        ...state.currentQso,
        qsoqras: arrayQraFinal,
        qraDeleted: true       
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 


     case UPDATE_QRA_URL:
    // console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
     
    const updatedItems1 = state.currentQso.qsoqras.map(item => {
        if(item.qra === action.qra){
          return { ...item, ...action.url }
        }
        return item
      })

    // actualizo tambien la lsit de searched de QslScan por si hace un Follow desde ahi
      const updatedItems1_1 = state.currentQso.qraShow.map(item => {
        if(item.qra === action.qra){
          return { ...item, ...action.url }
        }
        return item
      })

      const updatedItems1_2 = state.currentQso.qraSearched.map(item => {
        if(item.qra === action.qra){
          return { ...item, ...action.url }
        }
        return item
      })
  //    return updatedItems
    
    auxcurrentQso = {
        ...state.currentQso,
        qsoqras: updatedItems1,
        qraShow: updatedItems1_1,  
        qraSearched: updatedItems1_2          
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 



    case UPDATE_QSOQRA_SENT_STATUS:
    // console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
     
    const updatedItems2 = state.currentQso.qsoqras.map(item => {
   //     if(item.qra === action.qra){
          return { ...item, ...action.sentStatus }
    //    }
        return item
      })
  //    return updatedItems
    
    auxcurrentQso = {
        ...state.currentQso,
        qsoqras: updatedItems2           
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case UPDATE_ONLYONE_QSOQRA_SENT_STATUS:
    // console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
     
    const updatedItems3 = state.currentQso.qsoqras.map(item => {
        if(item.qra === action.qra){
          return { ...item, ...action.sentStatus }
        }
        return item
      })
  //    return updatedItems
    
    auxcurrentQso = {
        ...state.currentQso,
        qsoqras: updatedItems3           
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case UPDATE_MEDIA:
    // console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
     
    const updatedItems5 = state.currentQso.mediafiles.map(item => {
        if(item.name === action.filename){
          return { ...item, ...action.update }
        }
        return item
      })
  //    return updatedItems
    
    auxcurrentQso = {
        ...state.currentQso,
        mediafiles: updatedItems5           
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 


     case ADD_MEDIA:
     console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
     auxcurrentQso = {
        ...state.currentQso,
        mediafiles: [...state.currentQso.mediafiles, action.newmedia]           
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case CLOSE_MODALCONFIRM_PHOTO:
   //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
     auxcurrentQso = {
        ...state.currentQso,
        modalconfirmphoto: false,
        phototype: action.phototype          
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case OPEN_MODALCONFIRM_PHOTO:
   //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
     auxcurrentQso = {
        ...state.currentQso,
        modalconfirmphotoHeight: action.height,
        modalconfirmphoto: true          
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case OPEN_MODAL_RECORDING:
    //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      auxcurrentQso = {
         ...state.currentQso,
         modalrecording: true          
     };
     newStore = Object.assign({}, state,
         {
             ...state,
             currentQso: auxcurrentQso
         });
     return newStore; 

    case CLOSE_MODAL_RECORDING:
   //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
     auxcurrentQso = {
        ...state.currentQso,
        modalrecording: false
                  
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 
  
    case SEND_ACTUAL_MEDIA:
   //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
     auxcurrentQso = {
        ...state.currentQso,
        mediatosend: action.mediatosend          
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case ACT_INDICATOR_IMAGE_ENABLED:
    //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      auxcurrentQso = {
         ...state.currentQso,
         activityindicatorImage: true          
     };
     newStore = Object.assign({}, state,
         {
             ...state,
             currentQso: auxcurrentQso
         });
     return newStore; 


     case ACT_INDICATOR_POST_QSO_NEW_TRUE:
    //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      auxcurrentQso = {
         ...state.currentQso,
         activityindicatorPostQsoNew: true          
     };
     newStore = Object.assign({}, state,
         {
             ...state,
             currentQso: auxcurrentQso
         });
     return newStore; 

     case ACT_INDICATOR_POST_QSO_NEW_FALSE:
     //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
       auxcurrentQso = {
          ...state.currentQso,
          activityindicatorPostQsoNew: false         
      };
      newStore = Object.assign({}, state,
          {
              ...state,
              currentQso: auxcurrentQso
          });
      return newStore; 


     case CAMERA_PERMISSION_TRUE:
      //console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             camerapermission: true
         });
     return newStore; 

     case CAMERA_PERMISSION_FALSE:
     //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      
      newStore = Object.assign({}, state,
          {
              ...state,
              camerapermission: false
          });
      return newStore; 

      case AUDIO_RECORDING_PERMISSION_TRUE:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             audiorecordingpermission: true
         });
     return newStore; 

     case AUDIO_RECORDING_PERMISSION_FALSE:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             audiorecordingpermission: false
         });
     return newStore; 

     case NEW_QSO_ACTIVE_TRUE:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             newqsoactive: true
         });
     return newStore; 


     case NEW_QSO_ACTIVE_FALSE:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             newqsoactive: false
         });
     return newStore; 


     case SET_STOPALLAUDIOS:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             stopAllAudios: action.payload
         });
     return newStore; 

     case SET_URL_RDS_S3:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             urlRdsS3: action.urlrds
         });
     return newStore; 

     case PROFILE_PICTURE_REFRESH:
     // console.log("desdeREDUCER camera TRUE!! : "+JSON.stringify(action.newmedia));
     
     newStore = Object.assign({}, state,
         {
             ...state,
             profilePicRefresh: new Date().getTime(),
             profileUrlCondition: true
         });
     return newStore; 

     case ON_PROGRESS_TRUE:
     //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
       auxcurrentQso = {
          ...state.currentQso,
          onProgress: true        
      };
      newStore = Object.assign({}, state,
          {
              ...state,
              currentQso: auxcurrentQso
          });
      return newStore; 

      case ON_PROGRESS_FALSE:
     //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
       auxcurrentQso = {
          ...state.currentQso,
          onProgress: false        
      };
      newStore = Object.assign({}, state,
          {
              ...state,
              currentQso: auxcurrentQso
          });
      return newStore; 

      case SET_QRA:
     //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      
      newStore = Object.assign({}, state,
          {
              ...state,
              qra: action.qra
          });
      return newStore; 


       case QSO_SENT_UPDATES_AND_SQLRDSID:
      //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
        auxcurrentQso = {
           ...state.currentQso,
           sqlrdsId: action.sqlrdsid,
           qsotypeSent: action.typestatus,
           bandSent: action.bandstatus,
           modeSent: action.modestatus
                 
       };
       newStore = Object.assign({}, state,
           {
               ...state,
               currentQso: auxcurrentQso
           });
       return newStore; 

       case UPDATE_QSO_HEADER_STATUS:
       //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
         auxcurrentQso = {
            ...state.currentQso,
            bandSent: true,
            modeSent: true,
            qsotypeSent: true

        };
        newStore = Object.assign({}, state,
            {
                ...state,
                currentQso: auxcurrentQso
            });
        return newStore; 

        case RESET_QSO:
        //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
          auxcurrentQso = {
             ...state.currentQso,
             sqlrdsId: '',
             onProgress: false,
             datetime: '',
             qsoqras: [],
             qsotype: 'QSO',
             qsotypeSent: false,
             band: 'Band',
             bandSent: false,
             mode: 'Mode',
             modeSent: false,
             mediafiles: [],
             modalconfirmphoto: false,
             mediatosend: {},
             activityindicatorImage: false,
            
             
 
         };
         newStore = Object.assign({}, state,
             {
                 ...state,
                 currentQso: auxcurrentQso
             });
         return newStore; 

         case INSERT_FOLLOWINGS:
       
         auxcurrentQso = {
            ...state.currentQso,
            followings:  action.followings
                 
        };
        newStore = Object.assign({}, state,
            {
                ...state,
                currentQso: auxcurrentQso
            });
        return newStore; 


        case INSERT_FOLLOWERS:
       
        auxcurrentQso = {
           ...state.currentQso,
           followers: action.followers,           
       };
       newStore = Object.assign({}, state,
           {
               ...state,
               currentQso: auxcurrentQso
           });
       return newStore; 

        case FOLLOWERS_ALREADY_CALLED:
    //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
        auxcurrentQso = {
            ...state.currentQso,
            followersAlreadyCalled: action.status          
        };
        newStore = Object.assign({}, state,
            {
                ...state,
                currentQso: auxcurrentQso
            });
        return newStore; 

        case FOLLOWINGS_SELECTED:
        //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
          auxcurrentQso = {
             ...state.currentQso,
             followingsSelected: action.selected          
         };
         newStore = Object.assign({}, state,
             {
                 ...state,
                 currentQso: auxcurrentQso
             });
         return newStore; 

         case QRA_SEARCH:
         //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
           auxcurrentQso = {
              ...state.currentQso,
              qraSearched: action.qras,
              qraShow: action.qras          
          };
          newStore = Object.assign({}, state,
              {
                  ...state,
                  currentQso: auxcurrentQso
              });
          return newStore; 

          
          case UPDATE_QSL_SCAN:
         //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
       
         auxcurrentQso = {
            ...state.currentQso,
            qslscan: action.qslresult          
        };
        newStore = Object.assign({}, state,
            {
                ...state,
                currentQso: auxcurrentQso
               

            });
        return newStore; 

         
        case REFRESH_FOLLOWINGS:
        //  console.log("desdeREDUCER!! : "+JSON.stringify(action.newmedia));
      
        auxcurrentQso = {
           ...state.currentQso,
           refreshFollowings: action.status          
       };
       newStore = Object.assign({}, state,
           {
               ...state,
               currentQso: auxcurrentQso
              

           });
       return newStore; 

       case QRA_SEARCH_LOCAL:
     
     arrsearched = state.currentQso.qraSearched;
     if (action.count<4) arrsearched = [];

   
     console.log("REDUCER QRAs searched LOCAL: "+ JSON.stringify(arrsearched));
     QrasToShow =  filterQras(arrsearched, action.qratosearch);
    // string.includes(substring);

        function filterQras(arr, qratosearch){
            return arr.filter (arr => {
                return arr.qra.includes(qratosearch)
            })
        }

        console.log("REDUCER QRA searched DESPUES de filtrar LOCAL: "+ JSON.stringify(QrasToShow));

     auxcurrentQso = {
        ...state.currentQso,
        qraShow: QrasToShow
            
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 

    case SET_LOCATION:
    // console.log("desdeREDUCER!! : "+JSON.stringify(action.newqra));
    
    auxcurrentQso = {
        ...state.currentQso,
        latitude: action.lat,
        longitude: action.lon           
    };
    newStore = Object.assign({}, state,
        {
            ...state,
            currentQso: auxcurrentQso
        });
    return newStore; 


  
 


        
        

  
         default:
         return state;   
             }
}

export default qsoReducer;

