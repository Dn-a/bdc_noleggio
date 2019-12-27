<?php

namespace App\Http\Controllers;

use App\Comune;
use Illuminate\Http\Request;

class ComuneController extends Controller
{
    public function search(Request $request, $val)
    {

        $comune = Comune::where('nome','like',"$val%")->limit(5)->get();

        return  $comune;
    }
}
