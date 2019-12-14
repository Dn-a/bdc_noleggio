<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScontiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sconti', function (Blueprint $table) {
            $table->unsignedInteger('id_cliente');
            $table->unsignedInteger('id_dipendente');
            $table->float('percentuale_sconto',3,2);
        });

        Schema::table('sconti', function($table) {
        	$table->foreign('id_cliente')->references('id')->on('clienti')->onDelete('restrict');
            $table->foreign('id_dipendente')->references('id')->on('dipendenti')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sconti');
    }
}
