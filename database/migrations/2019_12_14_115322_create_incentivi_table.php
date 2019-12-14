<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIncentiviTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incentivi', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('da_noleggi_anno');
            $table->unsignedInteger('a_noleggi_anno');
            $table->float('precentuale',3,2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incentivi');
    }
}
