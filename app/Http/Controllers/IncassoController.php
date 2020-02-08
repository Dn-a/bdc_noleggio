<?php

namespace App\Http\Controllers;

use App\Cache;
use App\Http\Resources\IncassoCollection;
use App\Noleggio;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IncassoController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;

        $idPtVendita = $request->input('id_pt_vendita')? : $idPtVendita;

        $thirtyDayAgo = Carbon::today()->add('-29','day')->format('Y-m-d');
        $sevenDayAgo = Carbon::today()->add('-6','day')->format('Y-m-d');
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $today = Carbon::today()->format('Y-m-d');
        $lastHour = Carbon::now()->add('-1','hour');
        $lastMinutes = Carbon::now()->add('-5','minute');

        $checkTime = $lastMinutes;

        $cache = Cache::where('id_pt_vendita',$idPtVendita)->where('tipo','incassi');
        //$cache = Cache::firstOrNew(['id_pt_vendita' => $idPtVendita,'tipo' => 'incassi']);

        $check = clone $cache;
        $check = $check->where('update_at','>',$checkTime);

        if(empty($check->first())){

            $incassiDipendenti = DB::select( DB::raw(
                "SELECT CONCAT(d.nome,' ',d.cognome) AS nome, n.id_dipendente, sum(prezzo_tot + prezzo_extra) AS incasso_oggi,
                    (SELECT sum(prezzo_tot + prezzo_extra) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) ='$yesterday' AND n.id_dipendente = d.id
                        AND n.id_magazzino = m.id AND m.id_pt_vendita = $idPtVendita
                    ) AS incasso_ieri
                    FROM (noleggi AS n LEFT JOIN dipendenti AS d ON n.id_dipendente = d.id)
                    LEFT JOIN magazzino AS m ON n.id_magazzino = m.id
                    WHERE DATE(n.data_inizio) ='$today' AND m.id_pt_vendita = $idPtVendita
                    ".
                    //AND EXISTS (SELECT id FROM magazzino WHERE id_pt_vendita = $idPtVendita )
                    "GROUP BY n.id_dipendente,d.nome, d.cognome
                "
            ));

            $incassiPtVendita = DB::select( DB::raw(
                "SELECT p.titolo AS titolo, sum(n.prezzo_tot + n.prezzo_extra) AS incasso_oggi,
                    (SELECT sum(prezzo_tot + prezzo_extra) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) ='$yesterday' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS incasso_ieri,
                    (SELECT sum(prezzo_tot + prezzo_extra) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) >='$sevenDayAgo' AND DATE(n.data_inizio) <='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS incasso_week,
                    (SELECT sum(prezzo_tot + prezzo_extra) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) >='$thirtyDayAgo' AND DATE(n.data_inizio) <='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS incasso_month,
                    (SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) ='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS n_noleggi_oggi,
                    (SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) >='$sevenDayAgo' AND DATE(n.data_inizio) <='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS n_noleggi_week,
                    (SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE(n.data_inizio) >='$thirtyDayAgo' AND DATE(n.data_inizio) <='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = $idPtVendita
                    ) AS n_noleggi_month
                    FROM noleggi AS n LEFT JOIN (magazzino AS m LEFT JOIN pt_vendita AS p ON m.id_pt_vendita = p.id)
                    ON n.id_magazzino = m.id
                    WHERE DATE(n.data_inizio) ='$today' AND m.id_pt_vendita = $idPtVendita
                "
            ));

            $data = [
                'dipendenti' => $incassiDipendenti,
                'pt_vendita' => $incassiPtVendita
            ];

            //print_r('suca');exit;

            if(empty($cache->first())){
                $cache->insert([
                    'tipo' => 'incassi',
                    'id_pt_vendita' => $idPtVendita,
                    'json_data' => json_encode($data),
                    'update_at' => Carbon::now()
                ]);
            }else
                $cache->update([
                    'tipo' => 'incassi',
                    'id_pt_vendita' => $idPtVendita,
                    'json_data' => json_encode($data),
                    'update_at' => Carbon::now()
                ]);
        }


        $json_data = $cache->where('update_at','>', $checkTime)->first()->json_data;

        $datas = json_decode($json_data,true);

        return $datas;

        //return new IncassoCollection(User::hydrate($noleggi),false,null,$idPtVendita);
    }

}
