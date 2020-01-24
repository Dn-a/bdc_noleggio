<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoCollection;
use App\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 15;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Admin'? null: $user->id_pt_vendita;

        $video = Video::whereHas('magazzino',function($query) use($idPtVendita) {
            //$query->where('restituito_al_fornitore',0);
            if($idPtVendita!=null)
                $query->where('id_pt_vendita',$idPtVendita);
        })->orderBy('id','DESC')->paginate($page);

        return new VideoCollection($video, true
            //,$this->moreField($ruolo)
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $video = Video::
        //where('titolo',$arr[0])
        where('titolo','like',$val.'%')
        /*->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].'%')
                ->where('prov','like',$arr[1].'%');
            elseif(isset($arr[0]))
                $query->where('nome','like',$arr[0].'%');
        })*/
        ->limit(5)->get();

        return  new VideoCollection($video);
    }

    public function searchVideoNoleggi(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $idPtVendita = null;
        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        $video = Video::whereHas('magazzino',function($query) use($idPtVendita) {
            if($idPtVendita!=null)
                $query->where('id_pt_vendita',$idPtVendita);
        })
        //->where('titolo',$arr[0])
        ->where('titolo','like',$val.'%')
        ->limit(5)->get();

        return  new VideoCollection($video);
    }

    private function moreField($ruolo)
    {
        $moreFields = [

        ];

        if($ruolo=='Admin')
            $moreFields =  array_merge($moreFields,['pt_vendita']);

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
