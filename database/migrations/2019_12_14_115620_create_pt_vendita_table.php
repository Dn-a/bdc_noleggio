<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePtVenditaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pt_vendita', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titolo');
            $table->string('indirizzo');
            $table->unsignedInteger('id_comune')->default(1);
        });

        Schema::table('pt_vendita', function($table) {
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
        Schema::dropIfExists('pt_vendita');
    }
}
