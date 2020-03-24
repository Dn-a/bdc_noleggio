

const URL_HOME =  window.location.hostname =='www.g-soluzioniassicurative.it'? '/noleggio':'';

const User = () => {
    let config = typeof USER_CONFIG!== 'undefined' ? USER_CONFIG : {nome:'',ruolo:'',menu:[]};
    return config;
}

const ASSETS = {
    loader_gif : URL_HOME+'/img/loader.gif',
    loader_2 : URL_HOME+'/img/loader_2.gif',
    loader_3 : URL_HOME+'/img/loader_3.gif',
} 

export {URL_HOME,User,ASSETS};
