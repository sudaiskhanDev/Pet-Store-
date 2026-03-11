<?php

require __DIR__.'/admin.php';  // existing admin routes
require __DIR__.'/user.php';   // new user routes
require __DIR__.'/animal.php'; // Animals Category
require __DIR__.'/categories.php'; //Categories of Product
require __DIR__.'/products.php'; // Products API routes
require __DIR__.'/cart.php'; // Cart routes
require __DIR__.'/orders.php'; // Orders API routes
require __DIR__.'/order_items.php'; // Order Items API routes
require __DIR__.'/payments.php'; // Payments API routes


use App\Http\Controllers\Api\CheckoutController;

Route::middleware('auth:api')->group(function() {
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
});