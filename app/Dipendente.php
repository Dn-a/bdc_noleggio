<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dipendente extends Model
{
    protected $table = 'dipendenti';

    //public $timestamps = false;

    protected $fillable = [
        'nome', 'cognome', 'email', 'password','matricola','id_ruolo',
        'id_pt_vendita'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function ruolo()
    {
        return $this->belongsTo('App\Ruolo','id_ruolo');
    }

    public function puntoVendita()
    {
        return $this->belongsTo('App\PuntoVendita','id_pt_vendita');
    }
}
