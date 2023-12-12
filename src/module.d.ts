declare namespace Express {
  interface Request {
    session: import('./models/DTOs/session/ISession').ISession;
  }
}
