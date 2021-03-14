import {
    createServer,
    Server,
    IncomingMessage,
    ServerResponse,
    STATUS_CODES,
} from 'http';

import { compareUrl, getUrlParams } from './util/url';

// Request type
export interface Request<T = { [key: string]: string }>
    extends IncomingMessage {
    url: string;
    params: T;
}

// Response
export type Response = ServerResponse;

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

    private requestHandler(req: Request, res: ServerResponse) {
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
            res.end(STATUS_CODES[404]);
        } else {
            // Set defined params
            req.params = getUrlParams(handler.path, url);
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
