<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoleggioCollection;
use App\Noleggio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoleggioController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 15;

        //$user = Auth::user();
        //$ruolo = $user->ruolo->titolo;

        $noleggio = Noleggio::orderBy('id','DESC')->paginate($page);

        return new NoleggioCollection($noleggio, true);
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $caricati = in_array('caricati', explode('-',$only));


        $noleggio = Noleggio::where(function($query) use($arr) {
            $query->whereHas('video',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            })
            ->orWhereHas('puntoVendita',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            })
            ->orWhereHas('dipendente',function($query) use($arr) {
                if(count($arr)==2)
                    $query->where('nome','like',$arr[0].'%')
                    ->where('cognome','like',$arr[1].'%');
                else
                    $query->where('nome','like',$arr[0].'%')
                    ->orWhere('cognome','like',$arr[0].'%');
            })
            ->orWhereHas('fornitore',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%')
                ->orWhere('indirizzo','like',$arr[0].'%')
                ->orWhereHas('comune',function($query) use($arr) {
                    if(isset($arr[1]))
                        $query->where('nome','like',$arr[0].'%')
                        ->where('prov','like',$arr[1].'%');
                    elseif(isset($arr[0]))
                        $query->where('nome','like',$arr[0].'%');
                });
            });
        })
        ->limit(10)->get();


        return  new NoleggioCollection($noleggio,false);
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        //
    }


    public function show($id)
    {
        //
    }


    public function edit($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }
}
