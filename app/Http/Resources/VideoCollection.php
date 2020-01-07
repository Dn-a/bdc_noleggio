<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

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
        'img'
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

        $categoria = (string) $item->categoria->titolo;
        $regista = (string) $item->regista->nome
        .' '. (string) $item->regista->cognome;

        $item['categoria'] = $categoria;
        $item['regista'] = $regista;

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
