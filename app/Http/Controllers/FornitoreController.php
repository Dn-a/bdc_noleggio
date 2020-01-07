<?php

namespace App\Http\Controllers;

use App\Fornitore;
use App\Http\Resources\FornitoreCollection;
use Illuminate\Http\Request;

class FornitoreController extends Controller
{
    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $fornitore = Fornitore::
        where('titolo',$arr[0])
        ->orWhere('cf_piva',$arr[0])
        ->orWhere('titolo','like',$val.'%')
        ->orWhere('cf_piva','like',$val.'%')
        ->orWhere('indirizzo','like',$val.'%')
        ->orWhereHas('comune',function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].'%')
                ->where('prov','like',$arr[1].'%');
            elseif(isset($arr[0]))
                $query->where('nome','like',$arr[0].'%');
        })
        ->limit(5)->get();

        return  new FornitoreCollection($fornitore);
    }

}
