<?php

namespace App\Http\Controllers;

use App\Comune;
use Illuminate\Http\Request;

class ComuneController extends Controller
{
    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $comune = Comune::
        where('nome',$arr[0])
        ->orWhere('nome','like',$val.'%')
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].'%')
                ->where('prov','like',$arr[1].'%');
            elseif(isset($arr[0]))
                $query->where('nome','like',$arr[0].'%');
        })
        ->limit(5)->get();

        return  $comune;
    }
}
