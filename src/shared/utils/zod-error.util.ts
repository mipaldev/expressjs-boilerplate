import { ZodError } from 'zod';

function normalize(err: ZodError): Record<string, string[]> {
  return err.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_root';
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue.message);
    return acc;
  }, {});
}

function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}

export const zodErrorUtil = {
  normalize,
  isZodError,
};
