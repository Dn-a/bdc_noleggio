<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class RicevutaCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'tipo',
        'cliente',
        'pdf',
        'data_creazione'
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
        $collection = $this->collection->transform(function($ricevuta){
                return $this->filterFields($ricevuta);
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

        if(in_array('dipendente',$fields)){
            $dipendente = ucfirst((string) $item->dipendente->nome).' '.
            ucfirst((string) $item->dipendente->cognome);
            $item['dipendente'] = $dipendente;
        }
        if(in_array('cliente',$fields)){
            $cliente = ucfirst((string) $item->cliente->nome).' '.
            ucfirst((string) $item->cliente->cognome);
            $item['cliente'] = $cliente;
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
