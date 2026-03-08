<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';

    protected $fillable = [
        'category_id',
        'animal_id',
        'name',
        'description',
        'price',
        'stock_quantity',
        'image',
    ];

    // Relationship with Category
    public function category() {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    // Relationship with Animal
    public function animal() {
        return $this->belongsTo(Animal::class, 'animal_id', 'animal_id');
    }
}