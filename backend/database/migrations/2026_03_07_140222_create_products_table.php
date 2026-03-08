<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {

    $table->id('product_id');

    $table->unsignedBigInteger('category_id');
    $table->unsignedBigInteger('animal_id');

    $table->string('name');
    $table->text('description')->nullable();
    $table->decimal('price',10,2);
    $table->integer('stock_quantity');
    $table->string('image')->nullable();

    $table->timestamps();

    $table->foreign('category_id')
          ->references('category_id')
          ->on('categories')
          ->onDelete('cascade');

    $table->foreign('animal_id')
          ->references('animal_id')
          ->on('animals')
          ->onDelete('cascade');

});
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};