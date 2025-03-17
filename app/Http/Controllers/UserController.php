<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|integer|min:1|max:3',
        ]);

        $user->update($validated);

        return Redirect::back();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return Redirect::back();
    }
}