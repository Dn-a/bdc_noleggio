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

    public function caseProduzione()
    {
        return $this->belongsToMany('App\CasaProduzione','video_case_produzione','id_video','id_casa_produzione');
    }

    public function categoria()
    {
        return $this->belongsTo('App\Categoria','id_categoria');
    }

    public function regista()
    {
        return $this->belongsTo('App\Regista','id_regista');
    }
}
