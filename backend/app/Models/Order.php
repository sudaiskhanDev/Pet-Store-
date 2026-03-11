<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id','order_date','status','total_amount','payment_method','shipping_address','phone',
    ];

    public function user() { return $this->belongsTo(User::class,'user_id'); }
    public function orderItems() { return $this->hasMany(OrderItem::class,'order_id','order_id'); }
    public function payment() { return $this->hasOne(Payment::class,'order_id','order_id'); }
}