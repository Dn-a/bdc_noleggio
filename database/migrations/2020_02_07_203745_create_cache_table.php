<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCacheTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo',50);
            $table->unsignedInteger('id_pt_vendita');
            $table->mediumText('json_data');
            $table->timestamp('update_at')->useCurrent();
        });

        Schema::table('cache', function($table) {
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
        Schema::dropIfExists('cache');
    }
}
