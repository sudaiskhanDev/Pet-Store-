<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Payment;

class CheckoutController extends Controller
{
    public function placeOrder(Request $request)
    {
        $user = auth()->user();
        $carts = Cart::with('product')->where('user_id',$user->id)->get();

        if($carts->isEmpty()) return response()->json(['message'=>'Cart is empty'],400);

        $total = $carts->sum(fn($item)=> $item->product->price * $item->quantity);
        $shipping_address = $request->shipping_address;
        $phone = $request->phone;
        $payment_method = $request->payment_method;

        // Create order
        $order = Order::create([
            'user_id'=>$user->id,
            'total_amount'=>$total,
            'payment_method'=>$payment_method,
            'shipping_address'=>$shipping_address,
            'phone'=>$phone,
            'order_date'=>now()->toDateString(),
            'status'=>'pending'
        ]);

        // Create order items
        foreach($carts as $item){
            OrderItem::create([
                'order_id'=>$order->order_id,
                'product_id'=>$item->product_id,
                'quantity'=>$item->quantity,
                'price'=>$item->product->price
            ]);
        }

        // Create payment (for COD pending or Stripe later)
        Payment::create([
            'order_id'=>$order->order_id,
            'amount'=>$total,
            'status'=>$payment_method=='cod'?'pending':'pending'
        ]);

        // Clear user cart
        Cart::where('user_id',$user->id)->delete();

        return response()->json([
            'message'=>'Order placed successfully',
            'order'=>$order
        ]);
    }
}