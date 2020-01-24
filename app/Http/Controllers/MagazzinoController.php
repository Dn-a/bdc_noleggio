<?php

namespace App\Http\Controllers;

use App\Http\Resources\MagazzinoCollection;
use App\Magazzino;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MagazzinoController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 5;

        // seconda view che mostra i video restituiti al fornitore
        $only = $request->input('only') ?: '';

        $caricati = in_array('caricati', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Admin'? null: $user->id_pt_vendita;

        $magazzino = Magazzino::where('restituito_al_fornitore', $caricati? 1:0 )
        ->where(function($query) use($idPtVendita) {
            if( $idPtVendita!=null )
                $query->where('id_pt_vendita',$idPtVendita);
        })
        ->orderBy('id','DESC')->paginate($page);


        return new MagazzinoCollection($magazzino, true, $this->moreField($ruolo));
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $caricati = in_array('caricati', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Admin'? null: $user->id_pt_vendita;

        $magazzino = Magazzino::where('restituito_al_fornitore', $caricati? 1:0 )
        ->where(function($query) use($idPtVendita) {
            if( $idPtVendita!=null )
                $query->where('id_pt_vendita',$idPtVendita);
        })
        ->where(function($query) use($arr) {
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


        return  new MagazzinoCollection($magazzino,false,$this->moreField($ruolo));
    }

    private function moreField($ruolo)
    {
        $moreFields = [
        ];

        if($ruolo=='Admin')
            $moreFields =  array_merge($moreFields,['dipendente','pt_vendita']);

        return $moreFields;
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {

        try{
            //return response()->json([$request->all()],402);exit;
            //Validate
            $request->validate([
                'id_video' => 'required|integer',
                'id_fornitore' => 'required|integer',
                'quantita' => 'required|integer|min:1|max:30',
            ]);

            $input = $request->all();

            $idPtVendita = Auth::user()->id_pt_vendita;
            $idUser = Auth::user()->id;

            $input['id_pt_vendita'] = $idPtVendita;
            $input['id_dipendente'] = $idUser;

            // quantità di film da inserire
            $cnt = $input['quantita'];

            // tolgo i campi superflui
            unset($input['_token'], $input['quantita']);

            $array = [];
            for($i = 0 ; $i < $cnt ; $i++)
                $array[$i] = $input;

            $magazzino = new Magazzino();

            //$magazzino->fill($array)->save();
            $magazzino->insert($array);

            return response()->json(['msg' =>'added'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    public function carico(Request $request)
    {

        try{
            //return response()->json([$request->all()],402);exit;
            //Validate
            $request->validate([
                'array_id_magazzino' => 'required|array',
                'array_id_magazzino.*' => 'required|integer',
                'restituito_al_fornitore' => 'required|integer'
            ]);

            $arrayIDM = $request['array_id_magazzino'];

            $restituito = $request['restituito_al_fornitore'];

            //return response()->json($request->all(),500);exit;

            $magazzino = new Magazzino();

            $magazzino->whereIn('id',$arrayIDM)->update(['restituito_al_fornitore' => $restituito]);

            return response()->json(['msg' =>'update carico video'],201);

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

    }


    public function destroy($id)
    {
        Magazzino::destroy($id);

        return response()->json('deleted', 204);
    }
}
