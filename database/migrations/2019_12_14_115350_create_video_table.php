<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVideoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('video', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titolo',50)->unique();
            $table->string('trama');
            $table->unsignedInteger('durata');
            $table->unsignedInteger('id_categoria');
            $table->unsignedInteger('id_regista');
            $table->unsignedInteger('id_casa_produzione');
            $table->boolean('disponibile');
            $table->date('data_uscita');
            $table->float('prezzo');
            $table->string('img',2048);
        });

        Schema::table('video', function($table) {
        	$table->foreign('id_categoria')->references('id')->on('categorie')->onDelete('restrict');
        	$table->foreign('id_regista')->references('id')->on('registi')->onDelete('restrict');
        	$table->foreign('id_casa_produzione')->references('id')->on('case_produzione')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('video');
    }
}
