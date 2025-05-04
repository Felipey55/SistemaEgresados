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
            'fecha_publicacion' => 'required|date',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $noticia = new Noticia($request->all());
        $noticia->autor_id = Auth::id();

        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $imagen->move(public_path('images/noticias'), $nombreImagen);
            $noticia->imagen_path = 'images/noticias/' . $nombreImagen;
        }

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
            'fecha_publicacion' => 'required|date',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $datosActualizar = $request->only(['titulo', 'contenido', 'fecha_publicacion']);

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($noticia->imagen_path && file_exists(public_path($noticia->imagen_path))) {
                unlink(public_path($noticia->imagen_path));
            }

            $imagen = $request->file('imagen');
            $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
            $imagen->move(public_path('images/noticias'), $nombreImagen);
            $datosActualizar['imagen_path'] = 'images/noticias/' . $nombreImagen;
        }

        $noticia->update($datosActualizar);

        return redirect()->route('noticias.index')
            ->with('success', 'Noticia actualizada exitosamente.');
    }

    public function destroy(Noticia $noticia)
    {
        $noticia->delete();

        return redirect()->route('noticias.index')
            ->with('success', 'Noticia eliminada exitosamente.');
    }

    public function verNoticias(Request $request)
    {
        $query = Noticia::with('autor');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('titulo', 'like', "%{$search}%")
                ->orWhere('contenido', 'like', "%{$search}%");
        }

        $noticias = $query->orderBy('fecha_publicacion', 'desc')
            ->paginate(10);

        return Inertia::render('Noticias/VerNoticias', [
            'noticias' => $noticias
        ]);
    }
}
