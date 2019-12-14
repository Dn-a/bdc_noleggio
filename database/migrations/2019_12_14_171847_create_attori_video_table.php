<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttoriVideoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attori_video', function (Blueprint $table) {
            $table->unsignedInteger('id_attore');
            $table->unsignedInteger('id_video');
        });

        Schema::table('attori_video', function($table) {
            $table->foreign('id_attore')->references('id')->on('attori')->onDelete('restrict');
            $table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attori_video');
    }
}
