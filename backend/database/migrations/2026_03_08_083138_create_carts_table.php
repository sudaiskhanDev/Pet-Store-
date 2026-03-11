
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity')->default(1);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     public function up(): void
//     {
//         Schema::create('carts', function (Blueprint $table) {
//             $table->id('cart_id'); // Primary Key
//             $table->unsignedBigInteger('user_id'); // FK → Users
//             $table->unsignedBigInteger('product_id'); // FK → Products
//             $table->integer('quantity')->default(1);
//             $table->timestamps();

//             // Foreign keys
//             $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
//             $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('carts');
//     }
// };