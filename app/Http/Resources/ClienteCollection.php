<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ClienteCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'nome',
        'cognome',
        'cf',
        'recapiti',
        'residenza',
        'fidelizzazione'
    ];
    protected $withPagination;
    private $idVideoPrenotazioni;
    private $idPtVendita;

    public function __construct($items, $withPagination=false, $fields=null,
        $idVideoPrenotazioni,$idPtVendita)
    {
        parent::__construct($items);
        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);
        if($idVideoPrenotazioni != null)
            $this->idVideoPrenotazioni = $idVideoPrenotazioni;
        if($idPtVendita != null)
            $this->idPtVendita = $idPtVendita;
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
        $fields = $this->withFields;

        if(in_array('recapiti',$fields)){
            $recapiti = 'tel: '.(string) $item->telefono . ' - cell: '.(string) $item->cellulare;
            $item['recapiti'] = $recapiti;
        }
        if(in_array('residenza',$fields)){
            $comune = (string) $item->indirizzo .' - '. (string) $item->comune->nome.' ('.(string) $item->comune->prov.')';
            $item['residenza'] = $comune;
        }
        if(in_array('fidelizzazione',$fields)){
            $fidelizzazione = $item->fidelizzazione;
            $item['fidelizzazione'] = $fidelizzazione;
        }
        if($this->idVideoPrenotazioni!=null && $this->idPtVendita!=null){
            $idptV = $this->idPtVendita;
            $id_video = $item->prenotazione()
            ->whereHas('dipendente', function($query) use($idptV) {
                $query->where('id_pt_vendita',$idptV);
            })
            ->whereIn('id_video',$this->idVideoPrenotazioni)
            ->pluck('id_video');
            $item['id_video'] = $id_video;
        }

        $item['nome'] = ucfirst((string) $item->nome);
        $item['cognome'] = ucfirst((string) $item->cognome);

        /*unset(
            $item['telefono'], $item['cellulare'],
            $item['indirizzo'], $item['comune'],
            //$item['fidelizzazione'],
            $item['id_comune'], $item['id_fidelizzazione']
        );*/


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
