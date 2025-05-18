<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('egresados', function (Blueprint $table) {
            $table->string('genero')->nullable(false)->default('Hombre');
        });
    }

    public function down()
    {
        Schema::table('egresados', function (Blueprint $table) {
            $table->dropColumn('genero');
        });
    }
};