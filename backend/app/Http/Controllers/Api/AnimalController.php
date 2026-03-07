<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Animal;

class AnimalController extends Controller
{
    // List all animals
    public function index()
    {
        return response()->json(Animal::all());
    }

    // Create new animal with validation and custom error message
    public function store(Request $request)
    {
        $data = $request->validate([
            'animal_name' => 'required|string|max:255|unique:animals,animal_name',
        ], [
            'animal_name.unique' => 'Ye animal name already exist karta hai!',
        ]);

        $animal = Animal::create($data);
        return response()->json($animal, 201);
    }

    // Show single animal
    public function show(Animal $animal)
    {
        return response()->json($animal);
    }

    // Update animal with unique validation and custom message
    public function update(Request $request, Animal $animal)
    {
        $data = $request->validate([
            'animal_name' => 'sometimes|required|string|max:255|unique:animals,animal_name,' . $animal->animal_id . ',animal_id',
        ], [
            'animal_name.unique' => 'Ye animal name already exist karta hai!',
        ]);

        $animal->update($data);
        return response()->json($animal);
    }

    // Delete animal
    public function destroy(Animal $animal)
    {
        $animal->delete();
        return response()->json(null, 204);
    }
}