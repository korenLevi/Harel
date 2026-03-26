<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });

        DB::table('users')->insert([
            [   
                'name' => 'Meital',
                'email' => 'meital@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Koren',
                'email' => 'koren@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Moshe',
                'email' => 'moshe@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'David',
                'email' => 'david@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
