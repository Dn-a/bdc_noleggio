<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoleggiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('noleggi', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_dipendente');
            $table->unsignedInteger('id_cliente');
            $table->unsignedInteger('id_fornitura');
            $table->unsignedInteger('id_video');
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_tariffa');
            $table->unsignedInteger('id_prenotazione');
            //$table->unsignedInteger('id_sconto');
            $table->date('data_inizio');
            $table->date('data_fine');
            $table->float('importo_pagato');
            $table->boolean('rimborso');
        });

        Schema::table('noleggi', function($table) {
        	$table->foreign('id_dipendente')->references('id')->on('dipendenti')->onDelete('restrict');
        	$table->foreign('id_cliente')->references('id')->on('clienti')->onDelete('restrict');
        	$table->foreign('id_fornitura')->references('id')->on('forniture')->onDelete('restrict');
        	$table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        	$table->foreign('id_tariffa')->references('id')->on('tariffe')->onDelete('restrict');
        	$table->foreign('id_prenotazione')->references('id')->on('prenotazioni')->onDelete('restrict');
        	//$table->foreign('id_sconto')->references('id')->on('sconti')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('noleggi');
    }
}
