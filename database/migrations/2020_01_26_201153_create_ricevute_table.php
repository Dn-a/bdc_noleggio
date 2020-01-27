<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRicevuteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ricevute', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo',50);
            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_dipendente');
            $table->unsignedInteger('id_cliente');
            $table->binary('pdf');
            $table->timestamp('data_creazione')->useCurrent();
        });

        Schema::table('ricevute', function($table) {
        	$table->foreign('id_cliente')->references('id')->on('clienti')->onDelete('restrict');
        	$table->foreign('id_dipendente')->references('id')->on('dipendenti')->onDelete('restrict');
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
        Schema::dropIfExists('ricevute');
    }
}
