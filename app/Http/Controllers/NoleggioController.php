<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoleggioCollection;
use App\Magazzino;
use App\Noleggio;
use PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoleggioController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 15;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $noleggio = Noleggio::whereHas('magazzino',function($query) use($idPtVendita) {
                $query->where('id_pt_vendita',$idPtVendita);
            })
            ->orderBy('id','DESC')->paginate($page);

        return new NoleggioCollection($noleggio, true, $this->moreField($ruolo) );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;

        $noleggio = Noleggio::where(function($query) use($arr) {
            $query->whereHas('magazzino',function($query) use($arr) {
                $query->whereHas('video',function($query) use($arr) {
                    $query->where('titolo','like',$arr[0].'%');
                });
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
        ->limit(10)->get();


        return  new NoleggioCollection($noleggio,false, $this->moreField($ruolo));
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
        $array = [
            'title'=>'aa',
            'content' => 'suca'
        ];

        return view('pdf.ricevuta_noleggio', $array);
        $pdf = PDF::loadView('pdf.ricevuta_noleggio', ['title'=>'aa','content' => 'suca']);
        return $pdf->download('ricevuta.pdf');
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
                'id_video.*' => 'required|integer',
                'prezzo_tot' => 'required|array',
                'prezzo_tot.*' => 'required|regex:/^\d+(\.\d{1,2})?$/',
                'data_fine' => 'required|array',
                'data_fine.*' => 'required|date|date_format:Y-m-d',
            ]);


            $input = $request->all();

            //return response()->json($input['id_video'],201);exit;

            $idDipendente = Auth::user()->id;
            $idPtVendita = Auth::user()->id_pt_vendita;

            $array = [];
            for( $i=0 ; $i < count($input['id_video']) ; $i++ ){
                // prendo l'id magazzino per usarlo nella tabella noleggi
                // seleziono il primo in ordine Ascendente
                $magazzino = Magazzino::
                        where('id_video',$input['id_video'][$i])
                        ->where('id_pt_vendita',$idPtVendita)
                        ->where('noleggiato',0)->orderBy('id','ASC')->first('id');

                if(empty($magazzino))
                    return response()->json(
                        [
                            'mgs' => 'video in magazzino terminati',
                            'id_video'=> $input['id_video'][$i]
                        ]
                    ,500);

                $magazzino->update(['noleggiato' => 1]);
                $array[$i] = [
                    'id_dipendente' => $idDipendente,
                    'id_cliente' => $input['id_cliente'],
                    'id_magazzino' => $magazzino->id,
                    'prezzo_tot' => $input['prezzo_tot'][$i],
                    'data_fine' => $input['data_fine'][$i],
                ];
            }

            $pdf = PDF::loadView('pdf.ricevuta_noleggio', ['title'=>'aa','content' => 'suca']);
            return $pdf->download('invoice.pdf');

            $noleggio = new Noleggio();

            $noleggio->insert($array);

            return response()->json(['msg' =>'added','data' => $noleggio],201);


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
        echo "Edit: ".$id;exit;
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        Noleggio::destroy($id);

        return response()->json(null, 204);
    }
}
