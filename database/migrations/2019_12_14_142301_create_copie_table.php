<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCopieTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('copie', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_video');
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_fornitore');
            $table->unsignedInteger('id_dipendente');
            $table->date('data_scarico')->useCurrent();
            $table->date('data_restituzione_copia');
            $table->date('data_prenotazione_noleggio');
            $table->boolean('danneggiato');
            $table->boolean('restituito');
            $table->boolean('noleggiato');
        });

        Schema::table('copie', function($table) {
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
        Schema::dropIfExists('copie');
    }
}
