<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.roles'); // Asegúrate de que la vista exista en resources/views/admin/roles.blade.php
    }
}
