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
            $table->unsignedInteger('id_magazzino');
            //$table->unsignedInteger('id_tariffa');
            $table->float('prezzo_tot');
            $table->float('prezzo_extra');
            $table->date('data_inizio');
            $table->date('data_fine');
        });

        Schema::table('noleggi', function($table) {
        	$table->foreign('id_cliente')->references('id')->on('clienti')->onDelete('restrict');
        	$table->foreign('id_dipendente')->references('id')->on('dipendenti')->onDelete('restrict');
            $table->foreign('id_magazzino')->references('id')->on('magazzino')->onDelete('restrict');
        	//$table->foreign('id_tariffa')->references('id')->on('tariffe')->onDelete('restrict');
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
