<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clienti', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nome',50);
            $table->string('cognome',50);
            $table->string('CF',16)->unique();
            $table->date('data_nascita');
            $table->string('email',50)->unique();
            $table->string('telefono',12);
            $table->string('cellulare',12);
            $table->string('indirizzo',50);
            $table->unsignedInteger('id_comune');
            $table->unsignedInteger('id_fidelizzazione');
            $table->binary('privacy');
        });

        Schema::table('clienti', function($table) {
        	$table->foreign('id_comune')->references('id')->on('comuni')->onDelete('restrict');
        	$table->foreign('id_fidelizzazione')->references('id')->on('fidelizzazioni')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clienti');
    }
}
