<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $tickets = Ticket::when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
                ->when($request->filled('priority'), function ($query) use ($request) {
                    $query->where('priority', $request->priority);
                })
                ->when($request->filled('assigned_user_id'), function ($query) use ($request) {
                    $query->where('assigned_user_id', $request->assigned_user_id);
                })
                ->get();

            if ($request->filled('sort_by')) {
                $tickets = $tickets->sortBy($request->sort_by, $request->get('sort_order', 'asc'));
            }

            return response()->json($tickets);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve tickets',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        try {

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required|in:low,medium,high',
                'status' => 'required|in:open,in_progress,closed',
                'assigned_user_id' => 'nullable|string',
            ]);

            $ticket = Ticket::create([
                ...$validated,
            ]);

            return response()->json([
                'message' => 'Ticket created successfully',
                'ticket' => $ticket
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create ticket',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function updateTickets(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                '*' => 'required|array',
                '*.id' => 'required|exists:tickets,id',
                '*.priority' => 'nullable|string|in:low,medium,high',
                '*.status' => 'nullable|string|in:open,in_progress,closed',
                '*.assigned_user_id' => 'nullable|exists:users,id',
            ]);

            $cantUpdateTickets = [];

            foreach ($validated as $ticketData) {
                $ticket = Ticket::find($ticketData['id']);
                if (!$ticket) {
                    continue;
                }

                if (isset($ticketData['status']) && $ticketData['status'] === 'closed' && !($ticketData['assigned_user_id'] ?? $ticket->assigned_user_id)) {
                    $cantUpdateTickets[] = $ticketData['id'];
                } else {
                    unset($ticketData['id']);
                    $ticket->update($ticketData);
                }
            }
            return response()->json(['message' => 'Tickets updated successfully', 'cantUpdateTickets' => $cantUpdateTickets]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update tickets', 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $ticketToDelete = Ticket::find($id);
            if (!$ticketToDelete) {
                return response()->json(['error' => 'Ticket not found'], 404);
            }
            $ticketToDelete->delete();
            return response()->json(['message' => 'Ticket deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete ticket', 'message' => $e->getMessage()], 500);
        }
    }
}
