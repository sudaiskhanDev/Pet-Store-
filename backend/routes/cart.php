<?php

use App\Http\Controllers\Api\CartController;

Route::prefix('carts')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/', [CartController::class, 'store']);
    Route::get('/{id}', [CartController::class, 'show']);
    Route::put('/{id}', [CartController::class, 'update']);
    Route::delete('/{id}', [CartController::class, 'destroy']);
});