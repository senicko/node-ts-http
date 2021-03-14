# Typescript http "overlay"

## In general ...

In order to learn how node `http` package works I decided to create something like `express` with it.

There is a support for:

-   url params
-   req body

## How it works

### Creating app instance

In order to start we have to initialize new App which class is defined in `lib/server.ts` file. It takes port as a parameter.

```ts
// Creates a app which will serve on localhost:3000
const app = new App(3000);
```

### Registering new handlers

Available methods (You can add more in App class, it is extremely easy)

-   GET
-   POST
-   PUT
-   DELETE

```ts
app.get('/users', (_req: Request, res: Response) => {
    //...
});
```

### Accessing params and body

params are located in handler `Response`. You can acces it like this

```ts
app.get('/users/:id', (_req: Request, res: Response) => {
    // Access id
    const id = req.params.id;

    // Send something to the client
    res.writeHead(200);
    res.end(`Passed id is ${id}`);
});
```

body works similarly

```ts
app.post('/users', (_req: Request, res: Response) => {
    // Access id
    const user = JSON.parse(req.body);

    //... DO SOMETHING WITH USER :O

    // Send something to the client
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(user));
});
```

That's all
