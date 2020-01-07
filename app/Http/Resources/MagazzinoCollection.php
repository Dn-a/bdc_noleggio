<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MagazzinoCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'video',
        //'pt_vendita',
        'fornitore',
        //'dipendente',
        'data_scarico',
        'ritiro',
        'noleggiato',
        'danneggiato',
        //'restituito_al_fornitore'
    ];
    protected $withPagination;


    public function __construct($items, $withPagination=false)
    {
        parent::__construct($items);
        $this->withPagination = $withPagination;
    }

    // Pagination
    // return array
    public function toArray($request)
    {
        $collection = $this->collection->transform(function($copia){
                return $this->filterFields($copia);
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

        $video = (string) $item->video->titolo;
        $fornitore = (string) $item->fornitore->titolo;
        $dipendente = (string) $item->dipendente->nome.' '.
            (string) $item->dipendente->cognome;
        $ptVendita = ' '. (string) $item->puntoVendita->titolo
            .' - '. (string) $item->puntoVendita->indirizzo
            .' - '. (string) $item->puntoVendita->comune->nome
            .' ('. (string) $item->puntoVendita->comune->prov.')';

        date_default_timezone_set("Europe/Rome");
        $ritiro = round( (strtotime($item->data_ritiro) - time()) / 86400 );

        $item['video'] = $video;
        $item['pt_vendita'] = $ptVendita;
        $item['fornitore'] = $fornitore;
        $item['dipendente'] = $dipendente;
        $item['ritiro'] = $ritiro;

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
