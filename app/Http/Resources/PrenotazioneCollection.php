<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PrenotazioneCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'id_cliente',
        'cliente',
        'video',
        'prezzo',
        'data_uscita',
        'data_prenotazione',
        'disp_magazzino',
        'img'
    ];
    protected $withPagination;
    private $idPtVendita;

    public function __construct($items, $withPagination=false, $fields=null,$idPtVendita)
    {
        parent::__construct($items);
        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);
        if($idPtVendita != null)
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

        if(in_array('data_uscita',$fields)){
            $dataUscita = (string) $item->video->data_uscita;
            $item['data_uscita'] =$dataUscita;
        }
        if(in_array('prezzo',$fields)){
            $item['prezzo'] = $item->video->prezzo;
        }
        if(in_array('img',$fields)){
            $img = (string) $item->video->img;
            $item['img'] = $img;
        }
        if(in_array('video',$fields)){
            $video = (string) $item->video->titolo;
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
        if(in_array('disp_magazzino',$fields) && $this->idPtVendita!=null){
            $dispMagazzino = $item
            //->with('magazzino')
            ->magazzino
            ->where('id_pt_vendita',$this->idPtVendita)
            ->first()!=null;
            $item['disp_magazzino'] = $dispMagazzino;
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
