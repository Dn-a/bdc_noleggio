<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTariffeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tariffe', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tariffa');
            $table->unsignedInteger('da_gg');
            $table->unsignedInteger('a_gg');
            $table->float('coefficiente');
            $table->boolean('attiva');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tariffe');
    }
}
