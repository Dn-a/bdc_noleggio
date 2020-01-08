<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateMagazzinoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('magazzino', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_video');
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_fornitore');
            $table->unsignedInteger('id_dipendente');
            $table->timestamp('data_scarico')->useCurrent();
            $table->timestamp('data_ritiro')->default(
                /*DB::raw(
                    'CREATE TRIGGER setDefaultDate
                    BEFORE INSERT ON magazzino
                    FOR EACH ROW
                    SET NEW.data_ritiro = ADDDATE(curdate(), INTERVAL 90 DAY)'
                )*/
            );
            $table->timestamp('data_prenotazione_noleggio')->nullable();
            $table->boolean('danneggiato')->default(0);
            $table->boolean('restituito_al_fornitore')->default(0);
            $table->boolean('noleggiato')->default(0);
        });

        Schema::table('magazzino', function($table) {
        	$table->foreign('id_dipendente')->references('id')->on('dipendenti')->onDelete('restrict');
        	$table->foreign('id_fornitore')->references('id')->on('fornitori')->onDelete('restrict');
        	$table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('magazzino');
    }
}
