<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            $table->string('imagen_path')->nullable()->after('contenido');
        });
    }

    public function down(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            $table->dropColumn('imagen_path');
        });
    }
};