<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cache extends Model
{
    protected $table = 'cache';

    public $timestamps = false;

    protected $fillable = [
        'id_pt_vendita', 'json_data','update_at'
    ];
}
