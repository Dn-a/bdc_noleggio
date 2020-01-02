<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $table = 'video';

    protected $fillable = [
        'titolo', 'durata', 'id_casa_produzione', 'id_categoria','id_regista','in_uscita',
        'data_uscita', 'prezzo', 'img'
    ];

    public function attori()
	{
        return $this->belongsToMany('App\Attore','attori_video','id_video','id_attore')->withTimestamps();//,'category_newspapers','newspaper_id','category_id'
    }

    public function casaProduzione()
    {
        return $this->hasOne('App\CasaProduzione','id_casa_produzione');
    }

    public function categoria()
    {
        return $this->hasOne('App\Categoria','id_categoria');
    }

    public function regista()
    {
        return $this->hasOne('App\Regista','id_regista');
    }
}
