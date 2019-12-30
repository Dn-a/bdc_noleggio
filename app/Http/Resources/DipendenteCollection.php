<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class DipendenteCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'nome',
        'cognome',
        'email',
        'matricola',
        'ruolo',
        'pt_vendita',
        'created_at'
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

        $ruolo = ' '.  (string) $item->ruolo->titolo.'';
        $ptVendita = ' '. (string) $item->puntoVendita->titolo
        .' - '. (string) $item->puntoVendita->indirizzo
        .' - '. (string) $item->puntoVendita->comune->nome
        .' ('. (string) $item->puntoVendita->comune->prov.')';


        unset(
            $item['punto_vendita'],
            $item['id_pt_vendita'],
            $item['email_verified_at'],
            //$item['created_at'],
            $item['updated_at'],
            $item['id_ruolo'],
            $item['ruolo']
        );

        $item['ruolo'] = $ruolo;
        $item['pt_vendita'] = $ptVendita;

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
