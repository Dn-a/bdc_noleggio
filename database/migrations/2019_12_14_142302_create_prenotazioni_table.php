<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePrenotazioniTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prenotazioni', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_video');
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_cliente');
            $table->date('data');
        });

        Schema::table('prenotazioni', function($table) {
        	$table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        	$table->foreign('id_cliente')->references('id')->on('clienti')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prenotazioni');
    }
}
