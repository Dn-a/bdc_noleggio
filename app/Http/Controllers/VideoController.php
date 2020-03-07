<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoCollection;
use App\Video;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{
    private $lmtSearch = 10;

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        //
        $only = $request->input('only') ?: '';
        $noleggi = in_array('noleggi', explode('-',$only));
        $inUscita = in_array('in_uscita', explode('-',$only));
        $catalogo = in_array('catalogo', explode('-',$only));

        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        $video = Video::
        //where('data_uscita', $inUscita ? '>=' : '<' , $date)
        where(function($query) use($inUscita, $catalogo) {
            if(!$catalogo){
                $date = Carbon::now();
                $date = $date->toDateString();
                //$query->where('data_uscita', $inUscita ? '>=' : '<' , $date);
                $query->where('in_uscita', $inUscita ? 1 : 0);
            }
        })
        ->where(function($query) use($idPtVendita,$noleggi) {
            if($noleggi)
                $query->whereHas('magazzino',function($query) use($idPtVendita) {
                    $query->where('id_pt_vendita',$idPtVendita);
                });
        })
        ->orderBy('id','DESC')->paginate($page);

        return new VideoCollection($video, true,
            $this->moreField($inUscita,$noleggi,$catalogo),
            $idPtVendita
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $noleggi = in_array('noleggi', explode('-',$only));
        $inUscita = in_array('in_uscita', explode('-',$only));
        $catalogo = in_array('catalogo', explode('-',$only));

        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        $video = Video::
        where(function($query) use($inUscita, $catalogo) {
            if(!$catalogo){
                $date = Carbon::now();
                $date = $date->toDateString();
                //$query->where('data_uscita', $inUscita ? '>=' : '<' , $date);
                $query->where('in_uscita', $inUscita ? 1 : 0);
            }
        })
        ->where(function($query) use($idPtVendita,$noleggi) {
            if($noleggi)
                $query->whereHas('magazzino',function($query) use($idPtVendita) {
                    $query->where('id_pt_vendita',$idPtVendita);
                });
        })
        ->where(function($query) use($arr) {
            $query->where('titolo','like',$arr[0].'%')
            ->orWhereHas('categoria',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            });
        })
        ->limit($this->lmtSearch)->get();

        return  new VideoCollection($video,false, $this->moreField($inUscita,$noleggi,$catalogo), $idPtVendita );
    }


    private function moreField($inUscita,$noleggi,$catalogo)
    {
        $moreFields = [            
        ];

        if($inUscita)
            $moreFields =  array_merge($moreFields,['numero_prenotazioni']);
        
        if($noleggi || $inUscita || $catalogo) 
            $moreFields =  array_merge($moreFields,['trama','attori','in_uscita']);

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
