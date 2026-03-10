<?php

use App\Http\Controllers\Api\OrderItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('order-items')->group(function () {
    Route::get('/', [OrderItemController::class, 'index']);
    Route::post('/', [OrderItemController::class, 'store']);
    Route::get('/{id}', [OrderItemController::class, 'show']);
    Route::put('/{id}', [OrderItemController::class, 'update']);
    Route::delete('/{id}', [OrderItemController::class, 'destroy']);
});