<?php

namespace App\Http\Controllers;

use App\Cliente;
use App\Http\Resources\NoleggioCollection;
use App\Magazzino;
use App\Noleggio;
use App\Prenotazione;
use App\Ricevuta;
use App\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PDF;

class NoleggioController extends Controller
{

    private $percSconto = [
        2 => '0.1',
        3 => '0.1',
        4 => '0.2',
        5 => '0.2',
        6 => '0.3',
        7 => '0.3',
        8 => '0.4'
    ];

    //private $percSconto = 20;{2:'0.1',3:'0.1',4:'0.2',5:'0.2',6:'0.3',7:'0.3',8:'0.4'}

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $storico = in_array('storico', explode('-',$only));

        $idCliente = $request->input('id_cliente') ? : null;

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $noleggio = Noleggio::where('data_restituzione',$storico?'!=':'=', null )
            ->where(function($query) use ($idCliente){
                if($idCliente!=null)
                    $query->where('id_cliente',$idCliente);   
            })
            ->whereHas('magazzino',function($query) use($idPtVendita) {
                $query->where('id_pt_vendita',$idPtVendita);
            })
            ->orderBy('id','DESC')->paginate($page);

        return new NoleggioCollection($noleggio, true, $this->moreField($ruolo,$storico) );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $storico = in_array('storico', explode('-',$only));

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $noleggio = Noleggio::where('data_restituzione',$storico?'!=':'=', null )
        ->whereHas('magazzino',function($query) use($idPtVendita) {
            $query->where('id_pt_vendita',$idPtVendita);
        })
        ->where(function($query) use($arr) {
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
        ->limit(15)->get();


        return  new NoleggioCollection($noleggio,false, $this->moreField($ruolo,$storico));
    }


    private function moreField($ruolo,$storico)
    {
        $moreFields = [
            'giorni_ritardo',
            'prezzo'
        ];

        if($storico)
            $moreFields =  array_merge($moreFields,['data_restituzione','danneggiato','ricevuta_noleggio','ricevuta_pagamento']);

        if($ruolo!='Addetto')
            $moreFields =  array_merge($moreFields,['dipendente']);

        return $moreFields;
    }


    public function create()
    {
        return $this->pdfGenerate([],'a');
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
                'prezzo_tot.*' => 'required|regex:/^\d+(\.\d{1,6})?$/',
                'data_fine' => 'required|array',
                'data_fine.*' => 'required|date|date_format:Y-m-d',
            ]);

            //return response()->json($request->all(),201);exit;

            $input = $request->all();

            $user = Auth::user();
            $idDipendente = $user->id;
            $idPtVendita = $user->id_pt_vendita;

            $idCliente = $input['id_cliente'];

            $arrayNlgInsert = [];

            // Field Ricevuta
            $totale = 0;
            $noleggi = [];
            $cntVideo = count($input['id_video']);
            for( $i=0 ; $i < $cntVideo ; $i++ ){

                $idVideo = $input['id_video'][$i];
                $prezzoTot = round($input['prezzo_tot'][$i],2);
                $dataFine = $input['data_fine'][$i];

                // prendo l'id magazzino
                // seleziono il primo in ordine Ascendente
                $magazzino = Magazzino::
                        where('id_video',$idVideo)
                        ->where('id_pt_vendita',$idPtVendita)
                        ->where('noleggiato',0)
                        ->where('danneggiato',0)
                        ->orderBy('id','ASC')
                        ->first('id');

                if(empty($magazzino))
                    return response()->json(
                        [
                            'mgs' => 'video in magazzino terminati',
                            'id_video'=> $idVideo
                        ]
                    ,500);

                $magazzino->update(['noleggiato' => 1]);

                $video = Video::where('id',$idVideo)->first();

                $prenotazione = Prenotazione::
                where('id_cliente',$idCliente)
                ->where('id_video',$idVideo)
                ->update(['ritirato' => 1]);

                $arrayNlgInsert[$i] = [
                    'id_dipendente' => $idDipendente,
                    'id_cliente' => $idCliente,
                    'id_magazzino' => $magazzino->id,
                    'prezzo' =>   $video->prezzo,
                    'prezzo_tot' => $prezzoTot,
                    'data_fine' => $dataFine,
                ];


                date_default_timezone_set("Europe/Rome");
                $gg = ceil( (strtotime($input['data_fine'][$i]) - time()) / 86400 );

                $scontoGG = 0;
                if($gg>1){
                    $prc = !isset($this->percSconto[$gg]) ? end($this->percSconto) : $this->percSconto[$gg];
                    $scontoGG = $video->prezzo * $gg * $prc;
                    //$scontoGG = $scontoGG > ($video->prezzo/2)? ($video->prezzo/2) : $scontoGG;
                }


                $noleggi[$i] = [
                    'descrizione' => $video->titolo,
                    'data_riconsegna' => $input['data_fine'][$i],
                    'n_giorni' => $gg,
                    'prezzo' => $video->prezzo,
                    'scontoGiorni' => $scontoGG,
                    'importo' =>  $prezzoTot
                ];

                $totale += $prezzoTot;
            }

            $cliente = Cliente::where('id',$input['id_cliente'])->first();

            $datiRicevutaNoleggio = [
                'ptVendita' => [
                    'titolo' => $user->puntoVendita->titolo,
                    'indirizzo' => $user->puntoVendita->indirizzo.' '.
                                   $user->puntoVendita->comune->nome.' ('.
                                   $user->puntoVendita->comune->prov.')'
                ],
                'cliente'=> [
                    'nome' => ucfirst($cliente->nome).' '.ucfirst($cliente->cognome),
                    'indirizzo' => ucfirst($cliente->indirizzo).' '.
                                   $cliente->comune->nome.' ('.
                                   $cliente->comune->prov.')',
                    'telefono' => $cliente->telefono,
                    'cellulare' => $cliente->cellulare,
                    'email' => $cliente->email
                ],
                'tabella' => $noleggi,
                'totale' => $totale,
                'titleField' => $cliente->fidelizzazione->titolo,
                'percField' => $cliente->fidelizzazione->percentuale*100

            ];

            $ricevuta = $this->pdfGenerate($datiRicevutaNoleggio,'noleggio');

            $idRicevuta = DB::table('ricevute')->insertGetId(
                [
                    'tipo' => 'noleggio',
                    'id_pt_vendita' => $idPtVendita,
                    'id_dipendente' => $idDipendente,
                    'id_cliente' => $input['id_cliente'],
                    'pdf' => $ricevuta
                ]
            );
            
            for( $j=0 ; $j <$cntVideo; $j++ )
                $arrayNlgInsert[$j]['id_ricevuta_noleggio'] = $idRicevuta;

            //return response()->json($datiRicevutaNoleggio,201);exit;

            $noleggio = new Noleggio();

            $noleggio->insert($arrayNlgInsert);

            return response()->json(['pdf' => $ricevuta],201);


        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    // PDF GENERATOR
    //
    private function pdfGenerate($array,$tipo)
    {
        /*$cliente = Cliente::where('id',3)->first();
        //var_dump($cliente->fidelizzazione->precentuale);exit;
        $array = [
            'ptVendita' => [
                'titolo' => 'Roma01',
                'indirizzo' => 'p.zza repubblica - Roma',
                'telefono' => '0142564589',
                'email' => 'info.roma@movierental.it'
            ],
            'cliente'=> [
                'nome' => 'Mario Rossi',
                'indirizzo' => 'via aa - Palermo',
                'telefono' => '012456236',
                'cellulare' => '33322544',
                'email' => 'email@email.com'
            ],
            'tabella' => [
                [
                    'descrizione' => 'cod. 1 - Pulp Fiction',
                    'n_giorni' => '2',
                    'prezzo' => '5',
                    'importo' => '10',
                    'scontoGiorni' => '1',
                    'danneggiato' => 'danneggiato'
                ],
            ],
            'tipoSconto' => $cliente->fidelizzazione->titolo,
            'sconto' => $cliente->fidelizzazione->percentuale,
            'totDanni' => '0',
            'costoGiorniExtra' => '0',
            'totaleParziale' => '10',
            'totale' => 10
        ];*/

        //return view('pdf.ricevuta_pagamento', $array);
        //PDF::setOptions(['dpi' => 96, 'fontHeightRatio' => '0.5']);
        //$pdf = PDF::loadView('pdf.ricevuta_pagamento', $array);
        $pdf = PDF::loadView('pdf.ricevuta_'.$tipo, $array);
        $file = $pdf->download('ricevuta.pdf');
        $blob = base64_encode($file);

        return $blob;
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
        try{
            //return response()->json($id,201);exit;
            //Validate
            $request->validate([
                'id_cliente' => 'required|integer',
                'id_noleggio' => 'required|array',
                'id_noleggio.*' => 'required|integer',
                'danneggiato' => 'required|array',
                'danneggiato.*' => 'required|integer',
                'prezzo_extra' => 'required|array',
                'prezzo_extra.*' => 'required|regex:/^\d+(\.\d{1,6})?$/'
            ]);

            $input = $request->all();

            //return response()->json($request->all(),201);exit;

            $user = Auth::user();
            $idDipendente = $user->id;
            $idPtVendita = $user->id_pt_vendita;


            $totaleParziale = 0;
            $totaleCostoDanni = 0;
            $totaleGiorniExtra = 0;
            $noleggi = [];
            $cntNoleggi = count($input['id_noleggio']);
            for( $i=0 ; $i < $cntNoleggi ; $i++ ){

                $idNoleggio = $input['id_noleggio'][$i];
                $danneggiato = $input['danneggiato'][$i];
                $extra = round($input['prezzo_extra'][$i],2);

                $magazzino = Magazzino::whereHas('noleggio',function($query) use($idNoleggio) {
                    $query->where('id',$idNoleggio);
                })->first();

                $magazzino->update(['noleggiato' => 0,'danneggiato' => $danneggiato]);

                $noleggio = Noleggio::where('id',$idNoleggio);

                $date = date('Y-m-d');
                $noleggio->update(['prezzo_extra' => $extra,'data_restituzione' => $date]);

                $noleggio = $noleggio->first();

                date_default_timezone_set("Europe/Rome");
                $gg = ceil( (strtotime($noleggio->data_fine) - strtotime($noleggio->data_inizio)) / 86400 );
                $ggExtra = ceil( (strtotime(date("Y-m-d")) - strtotime($noleggio->data_fine)) / 86400 );
                $ggExtra = $ggExtra<0 ? 0 : $ggExtra;

                $video = Video::where('id',$magazzino->id_video)->first();

                $importo = $noleggio->prezzo_tot;

                $scontoGG = 0;
                if($gg>1){
                    $prc = !isset($this->percSconto[$gg]) ? end($this->percSconto) : $this->percSconto[$gg];
                    $scontoGG = $video->prezzo * $gg * $prc;
                    //$scontoGG = $video->prezzo*($gg/40); $scontoGG = $scontoGG > ($video->prezzo/2)? ($video->prezzo/2) : $scontoGG;
                }

                $noleggi[$i] = [
                    'descrizione' => $video->titolo,
                    'danneggiato' => $danneggiato==1? 'danneggiato':'',
                    'n_giorni' => $gg,
                    'n_giorni_extra' => $ggExtra,
                    'prezzo' => $video->prezzo,
                    'scontoGiorni' => $scontoGG,
                    'importo' =>  $importo
                ];

                if($danneggiato==1)
                    $totaleCostoDanni += $video->prezzo*2;

                $totaleGiorniExtra += $video->prezzo*$ggExtra;

                $totaleParziale += $importo;
            }

            $cliente = Cliente::where('id',$input['id_cliente'])->first();

            $datiRicevutaPagamento = [
                'ptVendita' => [
                    'titolo' => $user->puntoVendita->titolo,
                    'indirizzo' => $user->puntoVendita->indirizzo.' '.
                                   $user->puntoVendita->comune->nome.' ('.
                                   $user->puntoVendita->comune->prov.')'
                ],
                'cliente'=> [
                    'nome' => ucfirst($cliente->nome).' '.ucfirst($cliente->cognome),
                    'indirizzo' => ucfirst($cliente->indirizzo).' '.
                                   $cliente->comune->nome.' ('.
                                   $cliente->comune->prov.')',
                    'telefono' => $cliente->telefono,
                    'cellulare' => $cliente->cellulare,
                    'email' => $cliente->email
                ],
                'tabella' => $noleggi,
                'totale' => $totaleParziale,
                'titleFidel' => $cliente->fidelizzazione->titolo,
                'percFidel' => $cliente->fidelizzazione->percentuale*100,
                'totDanni' => $totaleCostoDanni,
                'costoGiorniExtra' => $totaleGiorniExtra,
                'totaleParziale' => $totaleParziale
            ];

            $ricevuta = $this->pdfGenerate($datiRicevutaPagamento,'pagamento');

            //return response()->json(['pdf' => $ricevuta],201);exit;

            $idRicevuta = DB::table('ricevute')->insertGetId(
                [
                    'tipo' => 'pagamento',
                    'id_pt_vendita' => $idPtVendita,
                    'id_dipendente' => $idDipendente,
                    'id_cliente' => $input['id_cliente'],
                    'pdf' => $ricevuta
                ]
            );
                        
            $noleggio = new Noleggio();

            $noleggio->whereIn('id',$input['id_noleggio'])
            ->update(['id_ricevuta_pagamento' => $idRicevuta]);


            return response()->json(['pdf' => $ricevuta],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    public function destroy($id)
    {
        Noleggio::destroy($id);

        return response()->json(null, 204);
    }
}
