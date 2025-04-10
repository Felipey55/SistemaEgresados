<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function index(Request $request)
    {
        $query = Noticia::with('autor');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('titulo', 'like', "%{$search}%")
                ->orWhere('contenido', 'like', "%{$search}%");
        }

        $noticias = $query->orderBy('fecha_publicacion', 'desc')
            ->paginate(10);

        return Inertia::render('Noticias/Index', [
            'noticias' => $noticias
            
        ]);
    }

    public function create()
    {
        return Inertia::render('Noticias/Create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'fecha_publicacion' => 'required|date'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $noticia = new Noticia($request->all());
        $noticia->autor_id = Auth::id();
        $noticia->save();

        return redirect()->route('noticias.index')
            ->with('success', 'Noticia creada exitosamente.');
    }

    public function edit(Noticia $noticia)
    {
        return Inertia::render('Noticias/Edit', [
            'noticia' => $noticia->load('autor')
        ]);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'fecha_publicacion' => 'required|date'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $noticia->update($request->all());

        return redirect()->route('noticias.index')
            ->with('success', 'Noticia actualizada exitosamente.');
    }

    public function destroy(Noticia $noticia)
    {
        $noticia->delete();

        return redirect()->route('noticias.index')
            ->with('success', 'Noticia eliminada exitosamente.');
    }
}
