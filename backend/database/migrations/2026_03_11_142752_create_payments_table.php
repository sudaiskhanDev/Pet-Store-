<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id'); // ✅ Added: link payment to order
            $table->decimal('amount', 10, 2);
            $table->string('stripe_payment_id')->nullable();
            $table->enum('status',['pending','completed','failed'])->default('pending');
            $table->timestamps();

            // ✅ Added foreign key
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     public function up(): void
//     {
//         Schema::create('payments', function (Blueprint $table) {
//             $table->id();
//             $table->decimal('amount', 10, 2);
//             $table->string('stripe_payment_id')->nullable();
//             $table->enum('status',['pending','completed','failed'])->default('pending');
//             $table->timestamps();
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('payments');
//     }
// };