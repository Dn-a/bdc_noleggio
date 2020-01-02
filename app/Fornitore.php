<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Fornitore extends Model
{
    protected $table = 'fornitori';

    public function comune()
    {
        return $this->belongsTo('App\Comune','id_comune');
    }
}
