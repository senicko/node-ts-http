import { STATUS_CODES } from 'http';
import { App, Request, Response } from '../lib/server';

const port = process.env.PORT ?? 3000;
const app: App = new App(port);
let users: any[] = [];

app.get('/users', (_req: Request, res: Response) => {
    // Set Content-Type and status code
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200).end(JSON.stringify({ users }));
});

app.get('/users/:id', (req: Request, res: Response) => {
    // Find user
    const user = users.find(user => user.id === parseInt(req.params.id));

    // If user does not exists return 404
    if (!user) {
        res.writeHead(404);
        res.end('User not found');
    } else {
        // Return user
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200).end(JSON.stringify(user));
    }
});

app.post('/users', async (req: Request, res: Response) => {
    try {
        // Parse req body to json
        const body = JSON.parse(req.body);

        // Create new user
        const user = {
            id: users.length,
            ...body,
        };

        // Add new user to "database"
        users.push(user);

        // Send 201 response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(201).end(JSON.stringify(user));
    } catch (err) {
        // Send 500 response
        res.writeHead(500).end(STATUS_CODES[500]);
    }
});

app.delete('/users/:id', (req: Request, res: Response) => {
    // Get id from params
    const { id } = req.params;

    // Remove user from the array
    users = users.filter(user => user.id !== parseInt(id));

    // Send 200 response
    res.writeHead(200).end(STATUS_CODES[200]);
});

// Start app
app.listen(() => console.log(`Server started on port ${port}`));
