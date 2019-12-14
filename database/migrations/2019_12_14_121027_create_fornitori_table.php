<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFornitoriTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fornitori', function (Blueprint $table) {
            $table->increments('id');
            $table->string('CF');
            $table->string('denominazione');
            $table->string('indirizzo');
            $table->unsignedInteger('id_comune');
        });

        Schema::table('fornitori', function($table) {
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
        Schema::dropIfExists('fornitori');
    }
}
