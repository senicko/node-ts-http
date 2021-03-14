import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

import { compareUrl, getUrlParams } from './util/url';

// Request type
export interface Request<T = { [key: string]: string }>
    extends IncomingMessage {
    url: string;
    body: string;
    params: T;
}

// Response type
export type Response = ServerResponse;

// Request handler type
export type RequestHandler = (req: Request, res: ServerResponse) => void;

// RequestMeta structure
interface RequestHandlerMeta {
    path: string;
    method: string;
    handler: RequestHandler;
}

// Util for parsing req body to string
export const parseBody = (req: IncomingMessage): Promise<string> =>
    new Promise<string>((res, rej) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })
            .on('end', () => res(body))
            .on('error', err => rej(err));
    });

// App
export class App {
    private handlers: RequestHandlerMeta[] = [];
    private server: Server = createServer(
        (req: IncomingMessage, res: ServerResponse) =>
            this.requestHandler(req as Request, res)
    );

    constructor(private port: string | number) {}

    private async requestHandler(req: Request, res: ServerResponse) {
        const { method, url } = req;

        // Find handler in reqister handlers array
        const handler = this.handlers.find(
            (handler: RequestHandlerMeta) =>
                handler.method === method && compareUrl(handler.path, url)
        );

        // Check if handler exists
        if (!handler) {
            // If no return 404 message
            res.writeHead(404);
            res.end(`Cannot ${method} ${url}`);
        } else {
            // Set defined params
            req.params = getUrlParams(handler.path, url);

            // Set body
            req.body = await parseBody(req);

            // Call main handler
            handler.handler(req, res);
        }
    }

    private handle(
        path: string,
        method: string,
        handler: RequestHandler
    ): void {
        // Add new handler
        this.handlers.push({
            path,
            method: method.toUpperCase(),
            handler,
        });
    }

    // Get request handler
    get(path: string, handler: RequestHandler): void {
        this.handle(path, 'GET', handler);
    }

    // Post request handler
    post(path: string, handler: RequestHandler): void {
        this.handle(path, 'POST', handler);
    }

    // Put request handler
    put(path: string, handler: RequestHandler): void {
        this.handle(path, 'PUT', handler);
    }

    // Delete request handler
    delete(path: string, handler: RequestHandler): void {
        this.handle(path, 'DELETE', handler);
    }

    listen(cb?: () => void): void {
        // Start listening on specified port
        this.server.listen(this.port);
        // If there is a callback, fire it
        if (cb) cb();
    }
}
