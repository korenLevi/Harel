BEFORE:
public function getOpenTickets()
{
 $tickets = DB::select("SELECT * FROM tickets WHERE status = 'open'");
 return $tickets;
}

AFTER:
public function getOpenTickets()
{
  return Tickets::where('status','open');
}

מה שיפרתי? עדיף להשתמש ב־Eloquent במקום raw SQL. 
הקוד קריא יותר ותואם ל BEST PRACTIVE של LARAVEL
עוד אופצייה להשתמש ב SCOPE במודל:

public function scopeOpen($query)
{
  return $query->where('status', 'open');
}

ואז אפשר:

public function getOpenTickets()
{
  return Ticket::open()->get();
}


הוראות התקנה:
backend laravel: composer update php artisan serve
backend-node: npm i npm start
frontend-vainlla: npx serve .
frontend-react: npm i npm run dev

backend (Laravel): ה־API הראשי לניהול טיקטים (GET/POST/PUT /api/tickets) עם TicketController ו־Eloquent על מודל Ticket.
backend-node (Node/Express): שירות משלים נפרד שמתחבר ל־SQL Server ומספק בעיקר אנליטיקות כמו GET /tickets-insights.
frontend-vanilla: קליינט JavaScript ללא framework, עובד ישירות עם DOM, שולח בקשות ל־Laravel דרך service.js.
frontend-react: קליינט React (CRA) עם קומפוננטות כמו טופס/פילטר/טבלה, וגם הוא צורך את אותו API של Laravel דרך src/service.js.



