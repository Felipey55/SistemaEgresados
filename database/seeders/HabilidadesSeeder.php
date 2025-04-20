<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Habilidad;

class HabilidadesSeeder extends Seeder
{
    public function run()
    {
        // Habilidades Duras - Lenguajes de Programación
        $lenguajes = ['Java', 'Python', 'C / C++', 'JavaScript / TypeScript', 'PHP', 'C#', 'Kotlin / Swift', 'Go / Rust'];
        foreach ($lenguajes as $lenguaje) {
            Habilidad::create(['nombre' => $lenguaje, 'tipo' => 'Duras']);
        }

        // Habilidades Duras - Desarrollo Web y Móvil
        $desarrolloWeb = ['HTML / CSS', 'React / Angular / Vue.js', 'Node.js / Laravel / Django / Spring Boot', 
                         'Flutter / React Native', 'RESTful APIs / GraphQL'];
        foreach ($desarrolloWeb as $tecnologia) {
            Habilidad::create(['nombre' => $tecnologia, 'tipo' => 'Duras']);
        }

        // Habilidades Duras - Bases de Datos
        $basesDatos = ['MySQL / PostgreSQL', 'Oracle / SQL Server', 'MongoDB / Firebase', 'Redis / Cassandra'];
        foreach ($basesDatos as $bd) {
            Habilidad::create(['nombre' => $bd, 'tipo' => 'Duras']);
        }

        // Habilidades Duras - IA y Ciencia de Datos
        $ia = ['Machine Learning / Deep Learning', 'TensorFlow / PyTorch / scikit-learn', 
               'Análisis con Python o R', 'Big Data: Hadoop / Spark'];
        foreach ($ia as $tecnologia) {
            Habilidad::create(['nombre' => $tecnologia, 'tipo' => 'Duras']);
        }

        // Habilidades Duras - DevOps y Cloud
        $devops = ['Docker / Kubernetes', 'AWS / Azure / Google Cloud', 'Jenkins / GitHub Actions', 
                   'Terraform / Ansible'];
        foreach ($devops as $tecnologia) {
            Habilidad::create(['nombre' => $tecnologia, 'tipo' => 'Duras']);
        }

        // Habilidades Blandas
        $habilidadesBlandas = [
            'Comunicación efectiva', 'Pensamiento lógico', 'Resolución de problemas', 'Trabajo en equipo',
            'Adaptabilidad', 'Gestión del tiempo', 'Liderazgo', 'Empatía', 'Creatividad', 'Ética profesional',
            'Aprendizaje continuo', 'Proactividad', 'Tolerancia a la presión', 'Organización', 'Negociación',
            'Visión estratégica', 'Documentación de procesos'
        ];
        foreach ($habilidadesBlandas as $habilidad) {
            Habilidad::create(['nombre' => $habilidad, 'tipo' => 'Blandas']);
        }
    }
}