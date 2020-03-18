<?php

namespace App\Http\Controllers;

use App\Categoria;
use Illuminate\Http\Request;

class GenereController extends Controller
{
    private $lmtSearch = 5;

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        // view
        $only = $request->input('only') ?: '';        

        //$user = Auth::user();

        $generi = Categoria::
        where('titolo','like',$arr[0].'%')
        ->limit($this->lmtSearch)->get();


        return  $generi;
    }
}
