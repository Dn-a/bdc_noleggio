<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Noleggio extends Model
{
    protected $table = 'noleggi';

    public $timestamps = false;

    protected $fillable = [
        'id_cliente', 'id_dipendente', 'id_magazzino',
        'prezzo_tot', 'prezzo_extra', 'data_inizio', 'data_fine'
    ];


    public function magazzino()
    {
        return $this->belongsTo('App\Magazzino','id_magazzino');
    }

    public function cliente()
    {
        return $this->belongsTo('App\Cliente','id_cliente');
    }

    public function dipendente()
    {
        return $this->belongsTo('App\Dipendente','id_dipendente');
    }
}
