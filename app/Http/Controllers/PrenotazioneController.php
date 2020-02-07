<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrenotazioneCollection;
use App\Prenotazione;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrenotazioneController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $ritirati = in_array('ritirati', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $prenotazione = Prenotazione::where('ritirato',$ritirati ? 1:0 )
            ->where('id_pt_vendita',$idPtVendita)
            ->orderBy('id','DESC')->paginate($page);

        return new PrenotazioneCollection($prenotazione, true,
            $this->moreField($ruolo,$ritirati),
            $idPtVendita
        );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $ritirati = in_array('ritirati', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $noleggio = Prenotazione::where('ritirato',$ritirati ? 1:0 )
        ->where('id_pt_vendita',$idPtVendita)
        ->where(function($query) use($arr) {
            $query->whereHas('video',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            })
            ->orWhereHas('cliente',function($query) use($arr) {
                if(count($arr)==2)
                    $query->where('nome','like',$arr[0].'%')
                    ->where('cognome','like',$arr[1].'%');
                else
                    $query->where('nome','like',$arr[0].'%')
                    ->orWhere('cognome','like',$arr[0].'%')
                    ->orWhere('cf','like',$arr[0].'%');
            });
        })
        ->limit(15)->get();


        return  new PrenotazioneCollection($noleggio,false, $this->moreField($ruolo,$ritirati),null);
    }


    private function moreField($ruolo,$storico)
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
        //return $request->all();

        try{
            //return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'id_cliente' => 'required|integer',
                'id_video' => 'required|array',
                'id_video.*' => 'required|integer'
            ]);

            //return response()->json($request->all(),201);exit;

            $input = $request->all();

            $user = Auth::user();
            $idDipendente = $user->id;
            $idPtVendita = $user->id_pt_vendita;
            $array = [];

            for( $i=0 ; $i < count($input['id_video']) ; $i++ ){

                $array[$i] = [
                    'id_dipendente' => $idDipendente,
                    'id_cliente' => $input['id_cliente'],
                    'id_video' => $input['id_video'][$i],
                    'id_pt_vendita' => $idPtVendita
                ];

            }

            $prenotazione = new Prenotazione();

            $prenotazione->insert($array);

            return response()->json(['msg' => 'confirm'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
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


    public function destroy(Request $request, $id)
    {
        try{
            //return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'id_prenotazioni' => 'required|array',
                'id_prenotazioni.*' => 'required|integer'
            ]);

            //return response()->json($request->all(),201);exit;

            $input = $request->all();

            $idPrenotazioni = $input['id_prenotazioni'];

            //$prenotazione = Prenotazione:: whereIn('id',$idPrenotazioni) ->destroy();

            $prenotazione = Prenotazione::destroy($idPrenotazioni);

            return response()->json(['msg' => 'deleted'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }
}
