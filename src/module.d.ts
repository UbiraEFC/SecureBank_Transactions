declare namespace Express {
  interface Request {
    session: import('./models/DTOs/ISession').ISession;
  }
}
