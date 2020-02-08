<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

class IncassoCollection extends ResourceCollection
{
    protected $withFields = [
        'dipendente',
        'incasso',
        'incasso_dipendente',
        'incasso_pt_vendita'
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
        $fields = $this->withFields;

        if(in_array('incasso_dipendentea',$fields)){
            $idPtVendita = $this->idPtVendita;

            $dipendente = ucfirst((string) $item->dipendente->nome).' '.
                ucfirst((string) $item->dipendente->cognome);

            $oggi = $item->
            whereHas('magazzino', function($q) use($idPtVendita){
                $q->where('id_pt_vendita',$idPtVendita);
            })->sum(DB::raw('prezzo_tot + prezzo_extra'));

            $item['incasso_dipendente'] = [
                'dipendente' => $dipendente,
                'oggi' => $oggi
            ];
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
