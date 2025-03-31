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

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/historial-laboral', function () {
        $user = Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();
        
        if (!$egresado) {
            return redirect()->route('register');
        }

        $tieneFormacionAcademica = \App\Models\FormacionAcademica::where('egresado_id', $egresado->id)->exists();
        $tieneExperienciaLaboral = \App\Models\ExperienciaLaboral::where('egresado_id', $egresado->id)->exists();

        if ($tieneFormacionAcademica && $tieneExperienciaLaboral) {
            return redirect()->route('egresado.perfil');
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
        $user = Auth::user();
        $egresado = \App\Models\Egresado::where('user_id', $user->id)->first();
        
        if (!$egresado) {
            return redirect()->route('register');
        }

        $tieneFormacionAcademica = \App\Models\FormacionAcademica::where('egresado_id', $egresado->id)->exists();
        $tieneExperienciaLaboral = \App\Models\ExperienciaLaboral::where('egresado_id', $egresado->id)->exists();

        if ($tieneFormacionAcademica && $tieneExperienciaLaboral) {
            return redirect()->route('egresado.perfil');
        }

        return Inertia::render('Egresados/formacion-academica');
    })->name('formacion-academica');

    Route::get('/Egresados/perfil', function () {
        return Inertia::render('Egresados/perfil-egresado');
    })->name('egresado.perfil');

    Route::prefix('api/egresado')->group(function () {
        Route::get('/verificar-registro', [\App\Http\Controllers\EgresadoController::class, 'verificarRegistroCompleto']);
        Route::get('/perfil', [\App\Http\Controllers\EgresadoController::class, 'obtenerPerfil']);
    });

    Route::post('/formacion', [FormacionAcademicaController::class, 'store'])->name('formacion.store');

    // Noticias routes
    Route::resource('noticias', NoticiaController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
