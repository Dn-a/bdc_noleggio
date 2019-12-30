<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PuntoVendita extends Model
{
    protected $table = 'pt_vendita';

    public function comune()
    {
        return $this->belongsTo('App\Comune','id_comune');
    }
}
