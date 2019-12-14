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

            $table->string('nome');
            $table->string("cognome");
            $table->string('email')->unique();
            $table->string("matricola");

            $table->boolean('is_responsabile');

            $table->unsignedInteger('id_pt_vendita');
            $table->unsignedInteger('id_incentivo');

            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::table('dipendenti', function($table) {
        	$table->foreign('id_pt_vendita')->references('id')->on('pt_vendita')->onDelete('restrict');
        	$table->foreign('id_incentivo')->references('id')->on('incentivi')->onDelete('restrict');
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
