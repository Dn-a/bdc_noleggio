<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clienti';

    protected $fillable = [
        'nome', 'cognome', 'cf', 'data_nascita','email','telefono',
        'cellulare', 'indirizzo', 'id_comune', 'id_fidelizzazione','privacy'
    ];

    public function comune()
    {
        return $this->belongsTo('App\Comune','id_comune');
    }

    public function fidelizzazione()
    {
        return $this->belongsTo('App\Fidelizzazione','id_fidelizzazione');
    }

}
