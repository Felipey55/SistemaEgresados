<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GraduateRegistrationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ExperienciaLaboralController;
use App\Http\Controllers\RolModController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\FormacionAcademicaController;
use App\Models\User;
use App\Models\ExperienciaLaboral;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/historial-laboral', function () {
        $user = \Illuminate\Support\Facades\Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();

        if (!$egresado) {
            return redirect()->route('register');
        }

        return Inertia::render('Egresados/historial-laboral');
    })->name('historial-laboral');

    Route::post('/experiencia', [ExperienciaLaboralController::class, 'store'])->name('experiencia.store');
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/modUsers', function () {
        return Inertia::render('mod-users', [
            'users' => App\Models\User::all()
        ]);
    })->name('modUsers');

    Route::get('/user-mod/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/user-mod/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/user-mod/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/Egresados/regEgresados', function () {
        return Inertia::render('Egresados/registroEgresado');
    })->name('regEgresados');

    Route::post('/graduate', [GraduateRegistrationController::class, 'store'])->name('graduate.store');

    Route::get('/Egresados/formacion-academica', function () {
        $user = \Illuminate\Support\Facades\Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();

        if (!$egresado) {
            return redirect()->route('register');
        }

        return Inertia::render('Egresados/formacion-academica');
    })->name('formacion-academica');

    Route::get('/Egresados/perfil', function () {
        return Inertia::render('Egresados/perfil-egresado');
    })->name('egresado.perfil');

    Route::get('/formacion-academica/{id}/edit', function ($id) {
        return Inertia::render('Egresados/editar-formacion-academica', ['id' => $id]);
    })->name('formacion-academica.edit');

    Route::get('/experiencia-laboral/{id}/edit', function ($id) {
        $experiencia = ExperienciaLaboral::findOrFail($id);
        return Inertia::render('Egresados/experiencia-laboral-edit', [
            'experiencia' => $experiencia
        ]);
    })->name('experiencia-laboral.edit');



    Route::prefix('api/egresado')->group(function () {
        Route::get('/verificar-registro', [\App\Http\Controllers\EgresadoController::class, 'verificarRegistroCompleto'])->name('api.egresado.verificar-registro');
        Route::get('/perfil', [\App\Http\Controllers\EgresadoController::class, 'obtenerPerfil'])->name('api.egresado.perfil');
        Route::get('/datos', [\App\Http\Controllers\EgresadoController::class, 'obtenerDatos'])->name('api.egresado.datos');
    });

    Route::get('/Egresados/editar', function () {
        return Inertia::render('Egresados/editar-egresado');
    })->name('regEgresados.edit');

    Route::put('/egresado/update', [\App\Http\Controllers\EgresadoController::class, 'update'])->name('egresado.update');
    Route::put('/experiencia/update/{experienciaLaboral}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'update'])->name('experiencia.update');
    Route::put('/formacion/update/{id}', [\App\Http\Controllers\FormacionAcademicaController::class, 'update'])->name('formacion.update');

    Route::get('/api/experiencia/{id}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'show'])->name('api.experiencia.show');
    Route::get('/api/experiencia/datos/{id}', [\App\Http\Controllers\ExperienciaLaboralController::class, 'obtenerDatos'])->name('api.experiencia.datos');
    Route::get('/api/formacion/datos/{id?}', [\App\Http\Controllers\FormacionAcademicaController::class, 'datos'])->name('api.formacion.datos');

    Route::post('/formacion', [FormacionAcademicaController::class, 'store'])->name('formacion.store');

    // Noticias routes
    Route::resource('noticias', NoticiaController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';