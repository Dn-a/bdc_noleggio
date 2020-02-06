<?php

namespace App\Http\Controllers;

use App\Cliente;
use App\Http\Resources\ClienteCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        $cliente = Cliente::orderBy('id','DESC')->paginate($page);

        return new ClienteCollection($cliente,true,null,null,null);
    }


    public function search(Request $request, $val)
    {

        //return response()->json(empty($request->id_video),201);exit;

        $arr = explode(' ',$val);

        $user = Auth::user();
        $idPtVendita = $user->id_pt_vendita;

        // nella fase di prenotazione, quando viene selezionato un utente,
        // per evitare che uno stesso film venisse prenotato più di una volta dalla stessa persona,
        // viene eseguito un controllo sulla tabella prenotazioni, restituendo gli id dei video prenotati
        $idVideoPrenotazioni = json_decode($request->input('id_video_prenotazioni'));

        $cliente = Cliente::
        //where('nome','like',"$arr[0]%")
        where(function($query) use($arr) {
            if(count($arr)==1)
                $query->where('nome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(count($arr)==1)
                $query->where('cognome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('cognome','like',$arr[1].'%')
                ->where('nome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[1].'%')
                ->where('cognome','like',$arr[0].'%');
        })
        // Nel caso di due nomi
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%');
        })
        // Nel caso di due nomi e cognome
        ->orWhere(function($query) use($arr) {
            if(isset($arr[2]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%')
                ->where('cognome','like',$arr[2].'%');
        })

        /*
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('cognome','like','%'.$arr[1].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like','%'.$arr[1].'%');
        })*/

        //->orWhere('cognome','like',"$arr[0]%")
        ->orWhere('email','like',"$arr[0]%")
        ->orWhere('cf','like',"$arr[0]%")
        ->orWhere('telefono','like',"$arr[0]%")
        ->orWhere('cellulare','like',"$arr[0]%")->limit(10)->get();

        return new ClienteCollection($cliente,false,
            $this->moreField($idVideoPrenotazioni),
            $idVideoPrenotazioni, $idPtVendita
        );
    }

    private function moreField($idVideoPrenotazioni)
    {
        $moreFields = [
        ];

        if($idVideoPrenotazioni!=null)
            $moreFields =  array_merge($moreFields,['id_video']);

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
                'nome' => 'required|string|min:1|max:50',
                'cognome' => 'required|string|min:1|max:50',
                'cf' => 'required|string|min:1|max:16',
                'data_nascita' => 'required|date|date_format:Y-m-d',
                'telefono' => 'required|string|min:1|max:15',
                'cellulare' => 'required|string|min:1|max:15',
                'email' => 'required|string|email|max:50',
                'indirizzo' => 'required|string|min:1|max:50',
                'id_comune' => 'required|integer',
                'id_fidelizzazione' => 'required|integer',
                'privacy' => 'required|mimes:jpeg,bmp,png,pdf'
            ]);


            $input = $request->all();

            $temp = file_get_contents($request->privacy);
            $blob = base64_encode($temp);
            $input['privacy'] = $blob;

            $input['cf'] = strtoupper($request->cf);

            $cliente = new Cliente();

            $cliente->fill($input)->save();

            $id = $cliente->id;

            return response()->json(['msg' =>'added','data' => "{id:'{$id}'}"],201);

            //$this->responseEmail($request);
            //$this->notifyEmail($request);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],200);
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
        try{
            //return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'id_cliente' => 'required|integer',
                'id_fidelizzazione' => 'required|integer'
            ]);

            //return response()->json($request->all(),201);exit;

            $input = $request->all();

            $cliente = new Cliente();

            $cliente->where('id',$input['id_cliente'])->update(['id_fidelizzazione' => $input['id_fidelizzazione']]);

            return response()->json(['msg' =>'aggiornato'],201);


        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],200);
        }
    }


    public function destroy($id)
    {
        Cliente::destroy($id);

        return response()->json(null, 204);
    }
}
