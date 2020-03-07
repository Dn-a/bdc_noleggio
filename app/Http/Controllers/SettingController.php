<?php

namespace App\Http\Controllers;

use App\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    
    public function index()
    {
               
        //$setting = Setting::where('titolo','sconti')->first()->parametri;
        //$setting = json_decode($setting,true);

        $setting = Setting::orderBy('id','DESC')->get();

        return $setting;
    }


    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        //
    }

    
    public function show(Setting $setting)
    {
        //
    }

    
    public function edit(Setting $setting)
    {
        //
    }

    
    public function update(Request $request, Setting $setting)
    {
        //
    }

    
    public function destroy(Setting $setting)
    {
        //
    }
}
