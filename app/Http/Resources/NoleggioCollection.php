<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class NoleggioCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'cliente',
        'video',
        'prezzo_tot',
        'prezzo_extra',
        'data_inizio',
        'data_fine',
        'giorni'
    ];
    protected $withPagination;


    public function __construct($items, $withPagination=false, $fields=null)
    {
        parent::__construct($items);
        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);
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

        $video = (string) $item->magazzino->video->titolo;
        $dipendente = ucfirst((string) $item->dipendente->nome).' '.
            ucfirst((string) $item->dipendente->cognome);
        $cliente = ucfirst((string) $item->cliente->nome).' '.
            ucfirst((string) $item->cliente->cognome);
        $ptVendita = ' '. (string) $item->magazzino->puntoVendita->titolo
            .' - '. (string) $item->magazzino->puntoVendita->indirizzo
            .' - '. (string) $item->magazzino->puntoVendita->comune->nome
            .' ('. (string) $item->magazzino->puntoVendita->comune->prov.')';


        $item['dipendente'] = $dipendente;
        $item['cliente'] = $cliente;
        $item['video'] = $video;
        $item['pt_vendita'] = $ptVendita;

        date_default_timezone_set("Europe/Rome");
        $gg = ceil( (strtotime($item->data_fine) - time()) / 86400 );
        $giorni = $gg>=0 ? $gg : 0;

        $item['giorni'] = $giorni;

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
