<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ricevuta extends Model
{
    protected $table = 'ricevute';

    public $timestamps = false;

    protected $fillable = [
        'tipo', 'id_pt_vendita', 'id_dipendente', 'id_cliente',
        'pdf'
    ];

    public function puntoVendita()
    {
        return $this->belongsTo('App\PuntoVendita','id_pt_vendita');
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
