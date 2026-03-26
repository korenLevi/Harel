<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ReopenStaleHighPriorityTickets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tickets:reopen-stale-high {--hours=48}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reopen high priority tickets that were not updated within the configured hours.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $hours = (int) $this->option('hours');
        if ($hours <= 0) {
            $this->error('hours must be a positive integer.');
            return 1;
        }

        $cutoff = Carbon::now()->subHours($hours);

        $affected = Ticket::query()
            ->where('priority', 'high')
            ->where('status', 'in_progress')
            ->where('updated_at', '<=', $cutoff)
            ->update([
                'status' => 'open',
                'assigned_user_id' => null,
                'updated_at' => Carbon::now(),
            ]);

        $this->info("Reopened {$affected} stale high priority ticket(s).");
        return 0;
    }
}

