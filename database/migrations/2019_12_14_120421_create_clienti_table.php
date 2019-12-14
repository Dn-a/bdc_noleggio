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
            $table->string('nome');
            $table->string('cognome');
            $table->string('CF',16);
            $table->date('data_nascita');
            $table->string('email');
            $table->string('telefono');
            $table->string('cellulare');
            $table->string('indirizzo');
            $table->unsignedInteger('id_comune');
            $table->binary('privacy');
        });

        Schema::table('clienti', function($table) {
        	$table->foreign('id_comune')->references('id')->on('comuni')->onDelete('restrict');
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
