

export const hola=(qsoqras)=>{

    if ( (qsoqras.length > 0))
 {     return 'ESTA CON COSAS';
    } else 
  return 'ESTA EMPTY';
}

export const chau=()=>{
  return 'chau';
}

export const updateOnProgress=(qsotype,band,mode,qsoqras)=>{
 let devuelvo;
    if(qsotype==='POST'){
      
      return true;
    }
    else {
        if ((qsotype!=='POST') && (qsoqras.length > 0) && (band !== 'Band') && (mode !== 'Mode') )
        { 
            return true;
        } 
        else {
            return false; 
        
        }

    }
   
  }

  export const getDate =  () => {
    var day = '';
    var month = '';
    var hours = '';
    var minutes = '';
    var seconds = '';
    var now = new Date();
    var date = new Date( now.getTime() + (now.getTimezoneOffset() * 60000));
    var monthaux = date.getMonth() + 1;
    var dayOfMonthaux = date.getDate();
    var year = date.getFullYear();
    var houraux = date.getHours();
    var minutesaux = date.getMinutes();
    var secondsaux = date.getSeconds();

    if (monthaux<10) month = '0'+monthaux
      else
        month = monthaux;
    if (dayOfMonthaux<10) day = '0'+dayOfMonthaux
      else
       day = dayOfMonthaux;
    if (houraux<10) hours = '0'+houraux
       else
        hours = houraux;
    if (minutesaux<10) minutes = '0'+minutesaux
        else
         minutes  = minutesaux;
    if (secondsaux<10) seconds = '0'+secondsaux
        else
        seconds  = secondsaux;


    devuelvo = year + '-' + month + '-' + day + ' ' + hours+':'+minutes+':'+seconds;


    return devuelvo;

   }

   getDateHelper =  () => {
    var day = '';
    var month = '';
    var hours = '';
    var minutes = '';
    var seconds = '';
    var now = new Date();
    var date = new Date( now.getTime() + (now.getTimezoneOffset() * 60000));
    var monthaux = date.getMonth() + 1;
    var dayOfMonthaux = date.getDate();
    var year = date.getFullYear();
    var houraux = date.getHours();
    var minutesaux = date.getMinutes();
    var secondsaux = date.getSeconds();

    if (monthaux<10) month = '0'+monthaux
      else
        month = monthaux;
    if (dayOfMonthaux<10) day = '0'+dayOfMonthaux
      else
       day = dayOfMonthaux;
    if (houraux<10) hours = '0'+houraux
       else
        hours = houraux;
    if (minutesaux<10) minutes = '0'+minutesaux
        else
         minutes  = minutesaux;
    if (secondsaux<10) seconds = '0'+secondsaux
        else
        seconds  = secondsaux;


    devuelvo = year + '-' + month + '-' + day + ' ' + hours+':'+minutes+':'+seconds;


    return devuelvo;

   }

  export const check_firstTime_OnProgress=(qsotype,band,mode,qraowner,onprogress,sqlrdsid)=>{
     console.log("DENTRO de CHECK FIRST TIME");
     console.log("OnProgress: "+ onprogress);
    if (onprogress && sqlrdsid===''){

     
      fechaqso = this.getDateHelper();
      console.log("FECHAAA: " + fechaqso);


      const data = {
        "band" : band,
        "mode" : mode,
        "type" : qsotype,
        "longitude" : '-58.446850',
        "latitude": '-34.563976',
        "datetime": fechaqso,
        "qra_owner": qraowner
      };

      return data;
    }


  }

  export const getDateQslScan =  (fecha) => {

    year = fecha.substr(0,4);
    month = fecha.substr(5,2);
    day = fecha.substr(8,2);
    time = fecha.substr(11, 5);

    switch(month) {
        case '01': monthString = 'Jan';
        case '02': monthString = 'Feb';
        case '03': monthString = 'Mar';
        case '04': monthString = 'Apr';
        case '05': monthString = 'May';
        case '06': monthString = 'Jun';
        case '07': monthString = 'Jul';
        case '08': monthString = 'Ago';
        case '09': monthString = 'Sep';
        case '10': monthString = 'Oct';
        case '11': monthString = 'Nov';
        case '12': monthString = 'Dec';


    }



   return monthString + ' '+ day + ','+ ' '+year+' '+time;

  }

  export const getFollowStatus =  (followings,qratosearch) => {

  if (followings.length>0)
  {  
    devuelvo = 'false';

    followings.map(item => {
      if(item.qra === qratosearch){
        devuelvo = 'true' 
      }
      
    })

    return devuelvo;
  }
  else return 'empty';


  }
