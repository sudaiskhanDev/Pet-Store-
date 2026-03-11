<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['order_id','amount','stripe_payment_id','status'];

    public function order() { return $this->belongsTo(Order::class,'order_id','order_id'); }
}