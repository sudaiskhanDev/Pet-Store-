<?php

use App\Http\Controllers\Api\CartController;

Route::middleware('auth:user')->group(function () {
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'store']);
    Route::get('/carts/{id}', [CartController::class, 'show']);
    Route::put('/carts/{id}', [CartController::class, 'update']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);
});