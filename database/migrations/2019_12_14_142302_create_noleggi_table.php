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
            $table->float('prezzo');
            $table->float('prezzo_tot');
            $table->float('prezzo_extra');
            $table->timestamp('data_inizio')->useCurrent();
            $table->date('data_fine');
            $table->date('data_restituzione');
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
