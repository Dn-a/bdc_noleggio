<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoCollection;
use App\Video;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        //
        $only = $request->input('only') ?: '';
        $inUscita = in_array('in_uscita', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;//$ruolo=='Admin'? null:

        $date = Carbon::now();
        $date = $date->toDateString();

        // Vengono visualizzati solo
        // i video disponibili al momento in magazzino  nello specifico p.to vendita


        $video = Video::
        //where('in_uscita', $inUscita ? 1 : 0 )
        where('data_uscita',$inUscita?'>=':'<',$date)
        ->where(function($query) use($idPtVendita,$inUscita) {
            if(!$inUscita)
                $query->whereHas('magazzino',function($query) use($idPtVendita) {
                    $query->where('id_pt_vendita',$idPtVendita);
                });
        })
        ->orderBy('id','DESC')->paginate($page);

        return new VideoCollection($video, true,
            $this->moreField($inUscita),//,$this->moreField($ruolo)
            $idPtVendita
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $noleggi = in_array('noleggi', explode('-',$only));
        $inUscita = in_array('in_uscita', explode('-',$only));

        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        $date = Carbon::now();
        $date = $date->toDateString();

        $video = Video::
        //where('in_uscita', $inUscita ? 1 : 0 )
        where('data_uscita',$inUscita?'>=':'<',$date)
        ->where(function($query) use($idPtVendita,$noleggi) {
            //if($noleggi || !$inUscita)
            if($noleggi)
                $query->whereHas('magazzino',function($query) use($idPtVendita) {
                    $query->where('id_pt_vendita',$idPtVendita);
                });
        })
        ->where(function($query) use($arr,$inUscita) {
            $query->where('titolo','like',$arr[0].'%')
            ->orWhereHas('categoria',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            });
        })
        ->limit(10)->get();

        return  new VideoCollection($video,false, $this->moreField($inUscita), $idPtVendita );
    }


    private function moreField($inUscita)
    {
        $moreFields = [

        ];

        if($inUscita)
            $moreFields =  array_merge($moreFields,['numero_prenotazioni']);

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
