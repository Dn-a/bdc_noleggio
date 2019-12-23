<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dipendenti', function (Blueprint $table) {
            $table->increments('id');

            $table->string('nome',50);
            $table->string("cognome",50);
            $table->string('email',50)->unique();
            $table->string("matricola",20)->unique();
            $table->string('password');

            $table->unsignedInteger('id_ruolo')->default(1);
            $table->unsignedInteger('id_pt_vendita')->default(1);

            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::table('dipendenti', function($table) {
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        	$table->foreign('id_ruolo')->references('id')->on('ruoli')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dipendenti');
    }
}
