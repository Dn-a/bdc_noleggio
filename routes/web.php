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
    //'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
  ]);

//Route::get('/', 'HomeController@index')->name('home');

// browser request
if(request()->header('accept')!='application/json')
    Route::get('/{name}', 'HomeController@index')->name('home')
    ->where('name','(|home|clienti|dipendenti|video|magazzino|noleggi|restituzioni|incassi|setting)');


//Route::middleware(['auth'])->group( function () {
//Route::group(['middleware' => ['guest','auth']], function () {

    // Video
    Route::get('video/search/{val}', 'VideoController@search')->name('video.search');
    Route::resource('video', 'VideoController',['as' => 'video']);

    // Fornitori
    Route::get('fornitori/search/{val}', 'FornitoreController@search')->name('fornitori.search');

    // Comuni
    Route::get('comuni/search/{val}', 'ComuneController@search')->name('comuni.search');

    // Punti Vendita
    Route::get('punti-vendita/search/{val}', 'PuntoVenditaController@search')->name('punti-vendita.search');

    // Clienti
    Route::get('clienti/search/{val}', 'ClienteController@search')->name('clienti.search');
    Route::resource('clienti', 'ClienteController',['as' => 'clienti']);

    // Dipendenti
    Route::get('dipendenti/search/{val}', 'DipendenteController@search')->name('dipendenti.search');
    Route::resource('dipendenti', 'DipendenteController',['as' => 'dipendenti']);

    // Magazzino
    Route::get('magazzino/search/{val}', 'MagazzinoController@search')->name('magazzino.search');
    Route::resource('magazzino', 'MagazzinoController',['as' => 'magazzino']);


//});
