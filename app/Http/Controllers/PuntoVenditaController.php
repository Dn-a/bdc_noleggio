<?php

namespace App\Http\Controllers;

use App\PuntoVendita;
use Illuminate\Http\Request;

class PuntoVenditaController extends Controller
{
    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $ptVendita = PuntoVendita::with('comune')
        ->where('titolo',$arr[0])
        ->orWhere('titolo','like',$val.'%')
        ->orWhere('indirizzo','like',$val.'%')
        /*->orWhereHas('comune',function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].'%')
                ->where('prov','like',$arr[1].'%');
            elseif(isset($arr[0]))
                $query->where('nome','like',$arr[0].'%');
        })*/
        ->limit(5)->get();

        return  $ptVendita;
    }
}
