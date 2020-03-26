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

if(env('APP_DEBUG')){
    \DB::listen(function($sql)  {
        $log = \Log::channel('queries');
        $log->info($sql->sql);
        $log->info($sql->bindings);
        $log->info($sql->time);
    });
}

Auth::routes([
    'register' => false, // Registration Routes...
    //'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
  ]);

//Route::get('/', 'HomeController@index')->name('home');

// browser request
if(request()->header('accept')!='application/json')
    Route::get('/{name}', 'HomeController@index')->name('home')
    ->where(
        'name',
        '(|home|clienti|dipendenti|video|magazzino|noleggi|prenotazioni|restituzioni|incassi|catalogo|settings)'
    );


// ADMIN
//
Route::middleware(['auth','ruolo:admin'])->group( function () {

    // Punti Vendita
    Route::get('punti-vendita/search/{val}', 'PuntoVenditaController@search')->name('punti-vendita.search');
    Route::get('punti-vendita', 'PuntoVenditaController@index')->name('punti-vendita');

    // Settings
    Route::resource('settings', 'SettingController',['as' => 'settings']);

    // Catalogo
    Route::resource('catalogo', 'CatalogoController',['as' => 'catalogo']);

    // Attori
    Route::get('attori/search/{val}', 'AttoreController@search')->name('attori.search');

    // Registi
    Route::get('registi/search/{val}', 'RegistaController@search')->name('registi.search');

    // Generi
    Route::get('generi/search/{val}', 'GenereController@search')->name('generi.search');

});


// ADMIN | RESPONSABILE
//
Route::middleware(['auth','ruolo:admin|responsabile'])->group( function () {

    // Dipendenti
    Route::get('dipendenti/search/{val}', 'DipendenteController@search')->name('dipendenti.search');
    Route::resource('dipendenti', 'DipendenteController',['as' => 'dipendenti']);

    // Incasssi
    Route::get('incassi', 'IncassoController@index')->name('incassi');
});


// ADMIN | RESPONSABILE | ADDETTO
//
Route::middleware(['auth','ruolo:admin|responsabile|addetto'])->group( function () {

    // Video
    Route::get('video/search/{val}', 'VideoController@search')->name('video.search');
    //Route::get('video/search-noleggi/{val}', 'VideoController@searchVideoNoleggi')->name('video.searchNoleggi');//ricerca video disponibili per il noleggio
    Route::resource('video', 'VideoController',['as' => 'video']);

    // Prenotazione
    Route::get('prenotazioni/search/{val}', 'PrenotazioneController@search')->name('prenotazioni.search');
    Route::resource('prenotazioni', 'PrenotazioneController',['as' => 'prenotazioni']);

    // Noleggio
    Route::get('noleggi/search/{val}', 'NoleggioController@search')->name('noleggi.search');
    //Route::get('noleggi/video', 'NoleggioController@video')->name('noleggi.video');
    Route::resource('noleggi', 'NoleggioController',['as' => 'noleggi']);

    // Ricevute
    Route::get('ricevute/search/{val}', 'RicevutaController@search')->name('ricevute.search');
    Route::resource('ricevute', 'RicevutaController',['as' => 'ricevute']);

    // Fornitori
    Route::get('fornitori/search/{val}', 'FornitoreController@search')->name('fornitori.search');

    // Comuni
    Route::get('comuni/search/{val}', 'ComuneController@search')->name('comuni.search');

    // Clienti
    Route::get('clienti/search/{val}', 'ClienteController@search')->name('clienti.search');
    Route::resource('clienti', 'ClienteController',['as' => 'clienti']);

    // Magazzino
    Route::get('magazzino/search/{val}', 'MagazzinoController@search')->name('magazzino.search');
    Route::post('magazzino/carico', 'MagazzinoController@carico')->name('magazzino.carico');
    Route::resource('magazzino', 'MagazzinoController',['as' => 'magazzino']);

});
