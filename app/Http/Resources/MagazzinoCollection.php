<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

class MagazzinoCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'video',
        'fornitore',
        'data_scarico',
        'ritiro',
        'danneggiato',
    ];
    protected $withPagination;
    private $lstPtVendita;

    public function __construct($items, $withPagination=false, $fields=null,$lstPtVendita = false)
    {
        parent::__construct($items);
        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);

        $this->lstPtVendita = $lstPtVendita;
        $this->withPagination = $withPagination;
    }

    // Pagination
    // return array
    public function toArray($request)
    {
        $collection = $this->collection->transform(function($copia){
                return $this->filterFields($copia);
            });

        if($this->withPagination ){
            $rtn = [
                'data' => $collection,
                'pagination' => [
                    'total' => $this->total(),
                    'count' => $this->count(),
                    'per_page' => $this->perPage(),
                    'current_page' => $this->currentPage(),
                    'total_pages' => $this->lastPage()
                ]
            ];
            if($this->lstPtVendita)
                $rtn = array_merge($rtn,[
                    'lst_pt_vendita' => DB::table('pt_vendita')->select('id','titolo')->get()
                ]);
            return $rtn;
        }

        return $collection;
    }

    protected function filterFields($item)
    {
        $fields = $this->withFields;

        if(in_array('video',$fields)){
            $video = (string) $item->video->titolo;
            $item['video'] = $video;
        }
        if(in_array('fornitore',$fields)){
            $fornitore = (string) $item->fornitore->titolo;
            $item['fornitore'] = $fornitore;
        }
        if(in_array('dipendente',$fields)){
            $dipendente = (string) $item->dipendente->nome.' '.
            (string) $item->dipendente->cognome;
            $item['dipendente'] = $dipendente;
        }
        if(in_array('pt_vendita',$fields)){
            $ptVendita = ' '. (string) $item->puntoVendita->titolo
            .' - '. (string) $item->puntoVendita->indirizzo
            .' - '. (string) $item->puntoVendita->comune->nome
            .' ('. (string) $item->puntoVendita->comune->prov.')';
            $item['pt_vendita'] = $ptVendita;
        }
        if(in_array('ritiro',$fields)){
            date_default_timezone_set("Europe/Rome");
            $date = date("Y-m-d ");
            $day = (strtotime($item->data_ritiro) - strtotime($date)) / 86400;
            $gg = round($day);
            $ritiro = $gg>=0 ? $gg : 0;
            $item['ritiro'] = $ritiro;
        }


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
