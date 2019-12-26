<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Cliente;
use Faker\Generator as Faker;

$factory->define(Cliente::class, function (Faker $faker) {
    return [
        'nome' => $faker->name,
        'cognome' => $faker->unique()->safeEmail,
        'cf' => now(),
        'data_nascita' => now(),
        'email' => now(),
        'telefono' => now(),
        'cellulare' => now(),
        'indirizzo' => now(),
        'id_comune' => now(),
        'id_fidelizzazione' => now(),
    ];
});
