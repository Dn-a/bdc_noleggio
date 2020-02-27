<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class NoleggioCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'id_cliente',
        'cliente',
        'video',
        'prezzo_tot',
        'prezzo_extra',
        'data_inizio',
        'data_fine'
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
        $fields = $this->withFields;

        if(in_array('video',$fields)){
            $video = (string) $item->magazzino->video->titolo;
            $item['video'] = $video;
        }
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
        if(in_array('pt_vendita',$fields)){
            $ptVendita = ' '. (string) $item->magazzino->puntoVendita->titolo
            .' - '. (string) $item->magazzino->puntoVendita->indirizzo
            .' - '. (string) $item->magazzino->puntoVendita->comune->nome
            .' ('. (string) $item->magazzino->puntoVendita->comune->prov.')';
            $item['pt_vendita'] = $ptVendita;
        }
        if(in_array('giorni',$fields)){
            date_default_timezone_set("Europe/Rome");
            $date = date("Y-m-d ");
            $day = (strtotime($item->data_fine) - strtotime($date)) / 86400;
            $gg = round($day);
            $giorni = $gg>=0 ? $gg : 0;

            $item['giorni'] = $giorni;
        }
        /*if(in_array('prezzo',$fields)){
            $item['prezzo'] = $item->magazzino->video->prezzo;
        }
        if(in_array('prezzo_extra',$fields)){
            date_default_timezone_set("Europe/Rome");
            $date = date("Y-m-d ");
            $day = (strtotime($date) - strtotime($item->data_fine)) / 86400;
            $gg = round($day);
            $giorniRitardo = $gg>=0 ? $gg : 0;
            $prezzo = $item->magazzino->video->prezzo;
            $item['prezzo_extra'] = $prezzo*$giorniRitardo;
        }*/
        if(in_array('giorni_ritardo',$fields)){
            date_default_timezone_set("Europe/Rome");
            $date = date("Y-m-d ");
            $dataRest = $item->data_restituzione;
            if($dataRest!=null)
                $date = $dataRest;
            $day = (strtotime($date) - strtotime($item->data_fine)) / 86400;
            $gg = round($day);
            $giorniRitardo = $gg>=0 ? $gg : 0;

            $item['giorni_ritardo'] = $giorniRitardo;
        }
        if(in_array('danneggiato',$fields)){
            $danneggiato = $item->magazzino->danneggiato;
            $item['danneggiato'] = $danneggiato;
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
