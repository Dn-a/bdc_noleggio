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
    private $minutes = 1;

    public function index(Request $request)
    {
        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $ruolo=='Addetto'? -1 :$user->id_pt_vendita;

        if($ruolo=='Admin' && is_numeric($request->input('id_pt_vendita')))
            $idPtVendita = $request->input('id_pt_vendita');

        if($idPtVendita==-1) return;

        $thirtyDayAgo = Carbon::today()->add('-29','day')->format('Y-m-d');
        $sevenDayAgo = Carbon::today()->add('-6','day')->format('Y-m-d');
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $today = Carbon::today()->format('Y-m-d');
        $lastHour = Carbon::now()->add('-1','hour');
        $lastMinutes = Carbon::now()->add('-'.$this->minutes,'minute');

        $checkTime = $lastMinutes;

        $cache = Cache::where('id_pt_vendita',$idPtVendita)->where('tipo','incassi');
        //$cache = Cache::firstOrNew(['id_pt_vendita' => $idPtVendita,'tipo' => 'incassi']);

        $check = clone $cache;
        $check = $check->where('update_at','>',$checkTime);

        if(empty($check->first())){
            $date = 'n.data_inizio';
            //$date = 'n.data_fine';

            $incassiDipendenti = DB::select( DB::raw(
                "SELECT d.id, CONCAT(d.nome,' ',d.cognome) AS nome,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n
                        WHERE DATE($date) >='$thirtyDayAgo' AND DATE($date) <='$today'
                        AND n.id_dipendente = d.id
                    ),0) AS incasso_month,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n
                        WHERE DATE($date) >='$sevenDayAgo' AND DATE($date) <='$today'
                        AND n.id_dipendente = d.id
                    ),0) AS incasso_week,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n
                        WHERE DATE($date) ='$yesterday' AND n.id_dipendente = d.id
                    ),0) AS incasso_ieri,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n
                        WHERE DATE($date) ='$today' AND n.id_dipendente = d.id
                    ),0) AS incasso_oggi
                    FROM noleggi AS n RIGHT JOIN dipendenti AS d ON n.id_dipendente = d.id
                    WHERE d.id_pt_vendita = $idPtVendita
                    GROUP BY d.id
                "
            ));

            $incassiPtVendita = DB::select( DB::raw(
                "SELECT p.titolo AS titolo,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) ='$yesterday' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = p.id
                    ),0) AS incasso_ieri,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) ='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = p.id
                    ),0) AS incasso_oggi,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) >='$sevenDayAgo' AND DATE($date) <='$today'
                        AND n.id_magazzino = m.id AND m.id_pt_vendita = p.id
                    ),0) AS incasso_week,
                    IFNULL((SELECT ROUND(sum(prezzo_tot + prezzo_extra),2) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) >='$thirtyDayAgo' AND DATE($date) <='$today'
                        AND n.id_magazzino = m.id AND m.id_pt_vendita = p.id
                    ),0) AS incasso_month,
                    IFNULL((SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) ='$today' AND n.id_magazzino = m.id
                        AND m.id_pt_vendita = p.id
                    ),0) AS n_noleggi_oggi,
                    IFNULL((SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) >='$sevenDayAgo' AND DATE($date) <='$today'
                        AND n.id_magazzino = m.id AND m.id_pt_vendita = p.id
                    ),0) AS n_noleggi_week,
                    IFNULL((SELECT count(*) FROM noleggi AS n, magazzino AS m
                        WHERE DATE($date) >='$thirtyDayAgo' AND DATE($date) <='$today'
                        AND n.id_magazzino = m.id AND m.id_pt_vendita = p.id
                    ),0) AS n_noleggi_month
                    FROM pt_vendita AS p WHERE p.id = $idPtVendita GROUP BY titolo
                "
            ));

            $data = [
                'dipendenti' => $incassiDipendenti,
                'pt_vendita' => $incassiPtVendita
            ];

            //return $data;exit;

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

        $json_data = $cache->first()->json_data;

        $datas = json_decode($json_data,true);

        return $datas;

        //return new IncassoCollection(User::hydrate($noleggi),false,null,$idPtVendita);
    }

}
