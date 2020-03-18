<?php

namespace App\Http\Controllers;

use App\Attore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttoreController extends Controller
{
    private $lmtSearch = 4;
    
    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        // view
        $only = $request->input('only') ?: '';        

        //$user = Auth::user();

        $attori = Attore::
        where(function($query) use($arr) {
            if(count($arr)==2)
                $query->where('nome','like',$arr[0].'%')
                ->where('cognome','like',$arr[1].'%');
            else
                $query->where('nome','like',$arr[0].'%')
                ->orWhere('cognome','like',$arr[0].'%');
        })
        ->limit($this->lmtSearch)->get();


        return  $attori;
    }

}
