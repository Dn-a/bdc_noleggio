<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes([
    'register' => false, // Registration Routes...
    'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
  ]);

//Route::get('/', 'HomeController@index')->name('home');

// browser request
if(request()->header('accept')!='application/json')
    Route::get('/{name}', 'HomeController@index')->name('home')->where('name','(|home|clienti|video|deposito|noleggi|restituzioni|setting)');

Route::middleware('auth')->group( function () {

    Route::resource('clienti', 'ClienteController',['as' => 'clienti']);

});
