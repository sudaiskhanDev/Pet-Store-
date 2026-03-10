<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id'); // Primary Key
            $table->unsignedBigInteger('user_id'); // Foreign Key
            $table->date('order_date');
            $table->string('status')->default('pending');
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method');
            $table->text('shipping_address');
            $table->string('phone', 20);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};