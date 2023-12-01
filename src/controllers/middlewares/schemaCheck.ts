import { checkSchema, Schema } from 'express-validator';
import { Middleware } from 'express-validator/src/base';

function schemaCheck(schema: Schema): Middleware {
  return checkSchema(schema) as unknown as Middleware;
}

export default schemaCheck;
