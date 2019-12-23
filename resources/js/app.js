/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/Main');

$(document).ready(function () {

    let lts = localStorage.getItem('sideCollapse');
    let sidebar = $('#sidebar');
    let content = $('#content');

    if(lts=='active'){
        sidebar.addClass('active');
        content.addClass('active');
    }

    $('#sidebarCollapse').on('click', function () {

        sidebar.toggleClass('active');
        content.toggleClass('active');

        if(sidebar.hasClass('active')){
            localStorage.setItem('sideCollapse', 'active');
        }else
            localStorage.removeItem('sideCollapse','');
    });

});
