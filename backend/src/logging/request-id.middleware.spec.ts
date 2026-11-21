import { RequestIdMiddleware } from './request-id.middleware.js';

describe('RequestIdMiddleware', () => {
  it('puts a request id on the request', () => {
    const middleware = new RequestIdMiddleware();
    const req = {} as { requestId?: string };
    let continued = false;

    middleware.use(req as never, {} as never, () => {
      continued = true;
    });

    expect(continued).toBe(true);
    expect(req.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
