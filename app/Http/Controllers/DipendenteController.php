<?php

namespace App\Http\Controllers;

use App\Dipendente;
use App\Http\Resources\DipendenteCollection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DipendenteController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Admin'? null: ($ruolo=='Addetto'? -1 :$user->id_pt_vendita);

        $idPtVendita = $request->input('id_pt_vendita')? : $idPtVendita;

        $dipendente = Dipendente::
        where(function($query) use($idPtVendita) {
            if( $idPtVendita!=null )
                $query->where('id_pt_vendita',$idPtVendita);
        })->
        orderBy('id','DESC')->paginate($page);

        return new DipendenteCollection($dipendente, true, $this->moreField($ruolo));
    }


    public function search(Request $request, $val)
    {

        $arr = explode(' ',$val);
        //var_dump($arr);exit;
        //echo "cerca: ".$val;exit;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Admin'? null: ($ruolo=='Addetto'? -1 :$user->id_pt_vendita);

        $idPtVendita = $request->input('id_pt_vendita')? : $idPtVendita;

        $dipendente = Dipendente::
        where(function($query) use($idPtVendita) {
            if( $idPtVendita!=null )
                $query->where('id_pt_vendita',$idPtVendita);
        })
        ->where(function($query) use($arr) {
            $query->where('nome',$arr[0])
            ->orWhere('cognome',$arr[0])
            ->orWhere('nome','like',$arr[0].'%')
            ->orWhere('cognome','like',$arr[0].'%')
            ->orWhere(function($query) use($arr) {
                if(count($arr)==2)
                    $query->where('cognome','like',$arr[0].' '.$arr[1].'%');
            })
            ->orWhere(function($query) use($arr) {
                if(isset($arr[1]))
                    $query->where('cognome','like',$arr[1].'%')
                    ->where('nome','like',$arr[0].'%');
            })
            ->orWhere('email','like',"$arr[0]%")
            ->orWhere('matricola','like',"$arr[0]%")
            ->orWhereHas('ruolo',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            })
            ->orWhereHas('puntoVendita',function($query) use($arr) {
                $query->where('titolo','like',$arr[0].'%');
            });

        })
        // Nel caso di due nomi
        /*->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%');
        })*/
        // Nel caso di due nomi e cognome
        /*->orWhere(function($query) use($arr) {
            if(isset($arr[2]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%')
                ->where('cognome','like',$arr[2].'%');
        })        */
        ->limit(10)->get();

        return new DipendenteCollection($dipendente,false,$this->moreField($ruolo));
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
        //return $request->all();
        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;

        if($ruolo!='Admin')
            return response()->json(['msg' => 'forbidden'],500);

        try{
            //return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'nome' => 'required|string|min:1|max:50',
                'cognome' => 'required|string|min:1|max:50',
                'matricola' => 'required|string|min:1|max:20',
                'email' => 'required|string|email|max:50',
                'password' => 'required|string|min:8|max:255',
                'id_ruolo' => 'required|integer',
                'id_pt_vendita' => 'required|integer',
            ]);


            $input = $request->all();

            $input['matricola'] = strtoupper($request->matricola);

            $input['password'] = Hash::make($input['password']);

            $dipendente = new Dipendente();

            $dipendente->fill($input)->save();

            return response()->json(['msg' =>'added'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    public function show($id)
    {
        if($id=='search')
            abort(404);
        echo "Show: ".$id;exit;
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
        Dipendente::destroy($id);

        return response()->json('deleted', 204);
    }
}
