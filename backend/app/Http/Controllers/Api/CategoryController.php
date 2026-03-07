<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // List all categories
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    // Store a new category
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    // Case-insensitive uniqueness check
                    if (Category::whereRaw('LOWER(category_name) = ?', [strtolower($value)])->exists()) {
                        $fail('Category name already exists.');
                    }
                },
            ],
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    // Show a single category
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category);
    }

    // Update a category
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($id) {
                    // Case-insensitive uniqueness check for update
                    if (Category::whereRaw('LOWER(category_name) = ?', [strtolower($value)])
                        ->where('category_id', '!=', $id)
                        ->exists()) {
                        $fail('Category name already exists.');
                    }
                },
            ],
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category->update($request->all());

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    // Delete a category
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}