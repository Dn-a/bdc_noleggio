<?php

namespace App\Http\Controllers;

use App\Http\Resources\MagazzinoCollection;
use App\Magazzino;
use Illuminate\Http\Request;

class MagazzinoController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 5;

        $dipendente = Magazzino::orderBy('id','DESC')->paginate($page);

        return new MagazzinoCollection($dipendente, true);
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {

        try{
            return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'nome' => 'required|string|min:1|max:50',
                'cognome' => 'required|string|min:1|max:50',
                'matricola' => 'required|string|min:1|max:20',
                'email' => 'required|string|email|max:50',
                'password' => 'required|string|min:8|max:255',
                'id_ruolo' => 'required|integer',
                'id_pt_vendita' => 'required|integer',
            ]);


            $input = $request->all();

            $input['matricola'] = strtoupper($request->matricola);

            $input['password'] = Hash::make($input['password']);

            $dipendente = new Dipendente();

            $dipendente->fill($input)->save();

            return response()->json(['msg' =>'added'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],200);
        }
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
        //
    }


    public function destroy($id)
    {
        Magazzino::destroy($id);

        return response()->json('deleted', 204);
    }
}
