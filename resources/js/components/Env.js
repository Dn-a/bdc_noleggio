

const URL_HOME =  window.location.hostname =='www.dn-a.it'? '/noleggio':'';

const User = () => {
    let config = typeof USER_CONFIG!== 'undefined' ? USER_CONFIG : {nome:'',ruolo:'',menu:[]};
    return config;
}

const ASSETS = {
    loader_gif : URL_HOME+'/img/loader.gif',
} 

export {URL_HOME,User,ASSETS};
