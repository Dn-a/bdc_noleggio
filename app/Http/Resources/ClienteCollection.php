<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ClienteCollection extends ResourceCollection
{
    protected $withFields = [

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
    // return Array
    public function toArray($request)
    {
        $collection = $this->collection->transform(function($cliente){
                return $this->filterFields($cliente);
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
        $recapiti = 'tel: '.(string) $item->telefono . ' - cell: '.(string) $item->cellulare;
        $comune = (string) $item->indirizzo .' - '. (string) $item->comune->nome.' ('.(string) $item->comune->prov.')';
        $fidelizzazione = $item->fidelizzazione;


        $item['nome'] = ucfirst((string) $item->nome);
        $item['cognome'] = ucfirst((string) $item->cognome);

        $item['recapiti'] = $recapiti;
        $item['residenza'] = $comune;
        $item['fidelizzazione'] = $fidelizzazione;

        unset(
            $item['telefono'], $item['cellulare'],
            $item['indirizzo'], $item['comune'],
            //$item['fidelizzazione'],
            $item['id_comune'], $item['id_fidelizzazione']
        );


        if(empty($this->withFields)) return $item;

        $array = [];
        foreach($this->withFields AS $value){
            $array[$value] = $item[$value];
        }

        return $array;
    }



    public function withResponse($request, $response)
    {
        $jsonResponse = json_decode($response->getContent(), true);
        unset($jsonResponse['links'],$jsonResponse['meta']);
        $response->setContent(json_encode($jsonResponse));
    }

}
