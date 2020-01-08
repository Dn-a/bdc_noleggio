<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Magazzino extends Model
{
    protected $table = 'magazzino';

    public $timestamps = false;

    protected $fillable = [
        'id_video', 'id_fornitore', 'id_dipendente', 'id_pt_vendita','id_dipendente',
        'data_prenotazione_noleggio', 'danneggiato', 'restituito_al_fornitore', 'noleggiato'
    ];

    public function puntoVendita()
    {
        return $this->belongsTo('App\PuntoVendita','id_pt_vendita');
    }

    public function video()
    {
        return $this->belongsTo('App\Video','id_video');
    }

    public function fornitore()
    {
        return $this->belongsTo('App\Fornitore','id_fornitore');
    }

    public function dipendente()
    {
        return $this->belongsTo('App\Dipendente','id_dipendente');
    }
}
