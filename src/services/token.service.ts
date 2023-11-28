import jwt, { JwtPayload } from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export class TokenService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static generateToken(payload: any) {
    return jwt.sign({ ...payload }, JWT_SECRET as string, {
      expiresIn: '10d',
    });
  }

  static verifyToken<T extends string | JwtPayload = string>(token: string) {
    return jwt.verify(token, JWT_SECRET as string) as T;
  }
}
