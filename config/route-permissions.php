<?php

return [
    'routes' => [
        // Rutas de administrador
        'admin' => [
            'access.admin.panel',
            'manage.users',
        ],

        // Rutas de coordinador
        'coordinador' => [
            'access.coordinator.panel',
            'manage.graduates',
        ],

        // Rutas de egresado
        'egresado' => [
            'access.graduate.panel',
            'update.profile',
        ],
    ],

    'pages' => [
        // Rutas permitidas para egresados
        'egresado' => [
            'dashboard',
            'Noticias/Index',
            'Noticias/Edit',
            'Noticias/Create',
            'Egresados/perfiles-egresados',
            'Egresados/detalle-egresado',
        ],

        // Rutas restringidas para coordinador
        'coordinador_restricted' => [
            'mod-users',
        ],
    ],
];