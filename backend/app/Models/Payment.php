<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'amount','stripe_payment_id','status']; // ✅ Added order_id
}


// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Payment extends Model
// {
//     use HasFactory;

//     protected $fillable = ['amount','stripe_payment_id','status'];
// }