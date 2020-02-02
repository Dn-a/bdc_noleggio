<?php

namespace App\Http\Controllers;

use App\Http\Resources\RicevutaCollection;
use App\Ricevuta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RicevutaController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 15;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $ricevuta = Ricevuta::where('id_pt_vendita',$idPtVendita)
            ->orderBy('id','DESC')->paginate($page);

        return new RicevutaCollection($ricevuta, true, $this->moreField($ruolo) );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $noleggio = Ricevuta::where('id_pt_vendita',$idPtVendita)
        ->where(function($query) use($arr) {
            $query->where('tipo','like',$arr[0].'%')
            ->orWhereHas('cliente',function($query) use($arr) {
                if(count($arr)==2)
                    $query->where('nome','like',$arr[0].'%')
                    ->where('cognome','like',$arr[1].'%');
                else
                    $query->where('nome','like',$arr[0].'%')
                    ->orWhere('cognome','like',$arr[0].'%')
                    ->orWhere('cf','like',$arr[0].'%');
            })
            ->orWhereHas('dipendente',function($query) use($arr) {
                if(count($arr)==2)
                    $query->where('nome','like',$arr[0].'%')
                    ->where('cognome','like',$arr[1].'%')
                    ->orWhere('cognome','like',$arr[0].' '.$arr[1].'%');
                else
                    $query->where('nome','like',$arr[0].'%')
                    ->orWhere('cognome','like',$arr[0].'%');
            });
        })
        ->limit(15)->get();


        return  new RicevutaCollection($noleggio,false, $this->moreField($ruolo));
    }


    private function moreField($ruolo)
    {
        $moreFields = [
        ];

        if($ruolo!='Addetto')
            $moreFields =  array_merge($moreFields,['dipendente']);

        return $moreFields;
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
        echo "Edit: ".$id;exit;
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        Ricevuta::destroy($id);

        return response()->json(null, 204);
    }
}
