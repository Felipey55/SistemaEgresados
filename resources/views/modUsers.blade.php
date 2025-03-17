@extends('app')

@section('content')
@auth
    @if(Auth::user()->email === 'admin@gmail.com')
        <div class="container mt-4">
            <h2>Gestión de Usuarios</h2>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $user)
                            <tr>
                                <td>{{ $user->id }}</td>
                                <td>{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                <td>
                                    <form action="{{ route('user.updateRole', $user->id) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('PUT')
                                        <select name="role" class="form-select" onchange="this.form.submit()">
                                            <option value="admin" {{ $user->hasRole('admin') ? 'selected' : '' }}>Admin</option>
                                            <option value="coordinador" {{ $user->hasRole('coordinador') ? 'selected' : '' }}>Coordinador</option>
                                            <option value="egresado" {{ $user->hasRole('egresado') ? 'selected' : '' }}>Egresado</option>
                                        </select>
                                    </form>
                                </td>
                                <td>
                                    <form action="{{ route('user.delete', $user->id) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('¿Estás seguro de eliminar este usuario?')">
                                            Eliminar
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @else
        <div class="container mt-4">
            <div class="alert alert-danger">
                No tienes permiso para acceder a esta página.
            </div>
        </div>
    @endif
@else
    <div class="container mt-4">
        <div class="alert alert-warning">
            Debes iniciar sesión como administrador para acceder a esta página.
        </div>
    </div>
@endauth
@endsection