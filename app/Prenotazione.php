<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Prenotazione extends Model
{
    protected $table = 'prenotazioni';

    public $timestamps = false;

    protected $fillable = [
        'id_dipendente','id_cliente', 'id_video', 'ritirato'
    ];

    public function cliente()
    {
        return $this->belongsTo('App\Cliente','id_cliente');
    }

    public function dipendente()
    {
        return $this->belongsTo('App\Dipendente','id_dipendente');
    }

    public function video()
    {
        return $this->belongsTo('App\Video','id_video');
    }

    public function magazzino()
    {
        return $this->hasManyThrough('App\Magazzino', 'App\Video',
            'id',
            'id_video',
            'id_video',
            'id'
        );
    }
}
