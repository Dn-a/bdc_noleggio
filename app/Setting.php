<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    //protected $table = 'ruoli';
    
    public $timestamps = false;

    protected $fillable = [
        'titolo','parametri'
    ];
}
