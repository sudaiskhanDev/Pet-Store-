<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id',
        'order_date',
        'status',
        'total_amount',
        'payment_method',
        'shipping_address',
        'phone',
    ];

    // Relation to User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}