<?php

namespace App\Http\Controllers;

use App\CasaProduzione;
use Illuminate\Http\Request;

class CasaProduzioneController extends Controller
{
    private $lmtSearch = 5;

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        // view
        $only = $request->input('only') ?: '';

        //$user = Auth::user();

        $caseProduzione = CasaProduzione::
        where('nome','like',$arr[0].'%')
        ->limit($this->lmtSearch)->get();

        return  $caseProduzione;
    }
}
