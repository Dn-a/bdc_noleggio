<?php

namespace App\Http\Controllers;

use App\Cliente;
use App\Http\Resources\ClienteCollection;
use Illuminate\Http\Request;

class ClienteController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 5;

        $cliente = Cliente::orderBy('id','DESC')->paginate($page);

        return new ClienteCollection($cliente,[],true);
    }


    public function search(Request $request, $val)
    {

        $arr = explode(' ',$val);
        //var_dump($arr);exit;
        //echo "cerca: ".$val;exit;

        $cliente = Cliente::
        //where('nome','like',"$arr[0]%")
        orWhere(function($query) use($arr) {
            if(count($arr)==1)
                $query->where('nome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(count($arr)==1)
                $query->where('cognome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('cognome','like',$arr[1].'%')
                ->where('nome','like',$arr[0].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[1].'%')
                ->where('cognome','like',$arr[0].'%');
        })
        // Nel caso di due nomi
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%');
        })
        // Nel caso di due nomi e cognome
        ->orWhere(function($query) use($arr) {
            if(isset($arr[2]))
                $query->where('nome','like',$arr[0].' '.$arr[1].'%')
                ->where('cognome','like',$arr[2].'%');
        })

        /*
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('cognome','like','%'.$arr[1].'%');
        })
        ->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like','%'.$arr[1].'%');
        })*/

        //->orWhere('cognome','like',"$arr[0]%")
        ->orWhere('email','like',"$arr[0]%")
        ->orWhere('cf','like',"$arr[0]%")
        ->orWhere('telefono','like',"$arr[0]%")
        ->orWhere('cellulare','like',"$arr[0]%")->limit(10)->get();

        return new ClienteCollection($cliente);
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        //
    }


    public function show($id)
    {
        if($id=='search')
            abort(404);
        echo "Show: ".$id;exit;
    }


    public function edit($id)
    {
        echo "Edit: ".$id;exit;
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        Cliente::destroy($id);

        return response()->json(null, 204);
    }
}
