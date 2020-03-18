<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attore extends Model
{
    protected $table = 'attori';

    public $timestamps = false;

    public function video()
	{
        return $this->belongsToMany('App\Video','attori_video','id_video','id_attore');//,'category_newspapers','newspaper_id','category_id'
    }
}
