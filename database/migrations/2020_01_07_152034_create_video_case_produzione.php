<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVideoCaseProduzione extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('video_case_produzione', function (Blueprint $table) {
            $table->unsignedInteger('id_video');
            $table->unsignedInteger('id_casa_produzione');
        });

        Schema::table('video_case_produzione', function($table) {
            $table->foreign('id_video')->references('id')->on('video')->onDelete('restrict');
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
        Schema::dropIfExists('video_case_produzione');
    }
}
