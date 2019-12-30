<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ClienteCollection extends ResourceCollection
{
    protected $withFields = [];
    protected $withPagination;


    public function __construct($items,array $fields=[],$withPagination=false)
    {
        parent::__construct($items);
        $this->withFields = $fields;
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

        $item['recapiti'] = $recapiti;
        $item['residenza'] = $comune;
        $item['fidelizzazione'] = $fidelizzazione;

        unset(
            $item['telefono'], $item['cellulare'],
            $item['indirizzo'], $item['comune'],
            //$item['fidelizzazione'],
            $item['id_comune'], $item['id_fidelizzazione']
        );


        return $item;
        //if(empty($this->withFields)) return $array;

        //return array_filter($array,function($k) { return in_array($k,$this->withFields); } , ARRAY_FILTER_USE_KEY);
    }



    public function withResponse($request, $response)
    {
        $jsonResponse = json_decode($response->getContent(), true);
        unset($jsonResponse['links'],$jsonResponse['meta']);
        $response->setContent(json_encode($jsonResponse));
    }

}
