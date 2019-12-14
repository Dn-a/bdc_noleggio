<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFornitureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forniture', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_fornitore');
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_video');
            $table->date('data_consegna');
            $table->date('data_restituzione');
            $table->unsignedInteger('qta_fornita');
            $table->unsignedInteger('qta_disponibile');
            $table->double('tariffa_nol_giornaliera');
            $table->double('costo_unit_rimborso');
        });

        Schema::table('forniture', function($table) {
        	$table->foreign('id_fornitore')->references('id')->on('fornitori')->onDelete('restrict');
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        	$table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forniture');
    }
}
