<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

class VideoCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'titolo',
        'durata',
        'categoria',
        'regista',
        'data_uscita',
        'prezzo',
        'qta_disponibili',
        'qta_magazzino',
        'img'
    ];
    protected $withPagination;
    private $idPtVendita;


    public function __construct($items, $withPagination=false, $fields=null,$idPtVendita=null)
    {
        parent::__construct($items);
        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);
        if($idPtVendita!=null)
            $this->idPtVendita = $idPtVendita;
        $this->withPagination = $withPagination;
    }

    // Pagination
    // return array
    public function toArray($request)
    {
        $collection = $this->collection->transform(function($dipendente){
                return $this->filterFields($dipendente);
            });

        if($this->withPagination )
            return [
                'data' => $collection,
                'pagination' => [
                    'total' => $this->total(),
                    'count' => $this->count(),
                    'per_page' => $this->perPage(),
                    'current_page' => $this->currentPage(),
                    'total_pages' => $this->lastPage()
                ]
            ];

        return $collection;
    }

    protected function filterFields($item)
    {
        $fields = $this->withFields;

        if(in_array('qta_disponibili',$fields)){
            $idPtVendita = $this->idPtVendita;
            $qta_disponibili =
                $item->magazzino
                ->where('id_pt_vendita',$this->idPtVendita)
                ->where('restituito_al_fornitore',0)
                ->where('noleggiato',0)
                ->where('danneggiato',0)->count()
                -
                DB::table('prenotazioni')
                ->where('id_video',$item->id)
                ->where('id_pt_vendita',$idPtVendita)
                ->where('ritirato',0)->count();

            $item['qta_disponibili'] = $qta_disponibili;
        }
        if(in_array('qta_magazzino',$fields)){
            $qta_magazzino = count(
                $item->magazzino
                ->where('id_pt_vendita',$this->idPtVendita)
                ->where('restituito_al_fornitore',0)
            );
            $item['qta_magazzino'] = $qta_magazzino;
        }
        if(in_array('categoria',$fields)){
            $categoria = (string) $item->categoria->titolo;
            $item['categoria'] = $categoria;
        }
        if(in_array('regista',$fields)){
            $regista = (string) $item->regista->nome
            .' '. (string) $item->regista->cognome;
            $item['regista'] = $regista;
        }
        if(in_array('numero_prenotazioni',$fields)){
            $item['numero_prenotazioni'] =
            $item->prenotazione->where('id_pt_vendita',$this->idPtVendita)
            ->count();
        }

        $item['durata'] = (string) $item->durata .' minuti';

        if(empty($this->withFields)) return $item;

        $array = [];
        foreach($this->withFields AS $value){
            $array[$value] = $item[$value];
        }
        return $array;
    }


    // rimuove campi non necessari: 'links', 'meta'
    public function withResponse($request, $response)
    {
        $jsonResponse = json_decode($response->getContent(), true);
        unset($jsonResponse['links'],$jsonResponse['meta']);
        $response->setContent(json_encode($jsonResponse));
    }
}
