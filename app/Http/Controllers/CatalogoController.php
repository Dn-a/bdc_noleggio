<?php

namespace App\Http\Controllers;

use App\Video;
use Illuminate\Http\Request;

class CatalogoController extends Controller
{
    
    public function index()
    {
        //
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
        //
    }

    
    public function edit($id)
    {
        //
    }

    
    public function update(Request $request, $id)
    {
        try{
            //return response()->json($request->all(),422);exit;
            //Validate
            $request->validate([
                'disponibile' => 'required|integer',
            ]);
            
            $data = ['disponibile' => $request->disponibile];            
            
            $video = Video::find($id);
            
            $video->update($data);

            return response()->json(['insert' =>'Disponibilità aggiornata!'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }

    
    public function destroy($id)
    {
        //
    }
}
