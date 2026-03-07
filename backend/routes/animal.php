<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnimalController;

Route::prefix('animal')->group(function () {
    // List all animals
    Route::get('/', [AnimalController::class, 'index']);

    // Create new animal
    Route::post('/', [AnimalController::class, 'store']);

    // Get single animal
    Route::get('/{animal}', [AnimalController::class, 'show']);

    // Update existing animal
    Route::put('/{animal}', [AnimalController::class, 'update']);

    // Delete animal
    Route::delete('/{animal}', [AnimalController::class, 'destroy']);
});