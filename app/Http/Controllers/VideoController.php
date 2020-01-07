<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoCollection;
use App\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{

    public function index()
    {
        //
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $video = Video::
        where('titolo',$arr[0])
        ->orWhere('titolo','like',$val.'%')
        /*->orWhere(function($query) use($arr) {
            if(isset($arr[1]))
                $query->where('nome','like',$arr[0].'%')
                ->where('prov','like',$arr[1].'%');
            elseif(isset($arr[0]))
                $query->where('nome','like',$arr[0].'%');
        })*/
        ->limit(5)->get();

        return  new VideoCollection($video);
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
        //
    }


    public function destroy($id)
    {
        //
    }
}
