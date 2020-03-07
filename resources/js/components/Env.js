

const URL_HOME =  window.location.hostname =='www.dn-a.it'? '/noleggio':'';

const User = () => {
    let config = typeof USER_CONFIG!== 'undefined' ? USER_CONFIG : {nome:'',ruolo:'',menu:[]};
    return config;
}

export {URL_HOME,User};
