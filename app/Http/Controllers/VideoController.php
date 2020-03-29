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
        $inUscita = in_array('disponibile', explode('-',$only));
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
                $query->where('disponibile', $inUscita ? 0 : 1);
            }
        })
        ->where(function($query) use($idPtVendita,$noleggi) {
            if($noleggi)
                $query->whereHas('magazzino',function($query) use($idPtVendita) {
                    //$query->where('id_pt_vendita',$idPtVendita); ridondante
                    $query->whereHas('dipendente',function($query) use($idPtVendita) {
                        $query->where('id_pt_vendita',$idPtVendita);
                    });
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
        $inUscita = in_array('disponibile', explode('-',$only));
        $catalogo = in_array('catalogo', explode('-',$only));

        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        $video = Video::
        where(function($query) use($inUscita, $catalogo) {
            if(!$catalogo){
                $date = Carbon::now();
                $date = $date->toDateString();
                //$query->where('data_uscita', $inUscita ? '>=' : '<' , $date);
                $query->where('disponibile', $inUscita ? 0 : 1);
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
            $moreFields =  array_merge($moreFields,['trama','attori','disponibile']);

        return $moreFields;
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        try{
            //return response()->json($request->all(),201);exit;

            if($request->fase!='bozza')
                $request->validate([
                    'titolo' => 'required|string|min:1|max:50',
                    'durata' => 'required|integer',
                    'trama' => 'required|string|max:1024',
                    'disponibile' => 'required|integer',
                    'data_uscita' => 'required|date|date_format:Y-m-d',
                    'prezzo' => 'required|regex:/^\d+(\.\d{1,6})?$/',
                    'img' => 'required|string|max:2048',
                    'id_attori' => 'required|array',
                    'id_attori.*' => 'required|integer',
                    'id_categoria' => 'required|integer',
                    'id_regista' => 'required|integer',
                ]);

            //return response()->json($request->except('id_attori'),201);exit;

            $data = $request->except('id_attori');

            $video = Video::create($data);

            $video->attori()->sync($request->id_attori);


            $msg = 'Video Inserito!';

            return response()->json(['insert' => $msg],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],422);
        }
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
