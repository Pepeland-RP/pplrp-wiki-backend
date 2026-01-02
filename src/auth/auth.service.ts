import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'node:fs';

export interface JWTPayload {
  token_id: string;
  user: {
    user_id: number;
    login: string;
    permissions_mask: number;
  };
}

@Injectable()
export class AuthService {
  private readonly privateKey: Buffer;
  private readonly publicKey: Buffer;

  constructor(private prisma: PrismaService) {
    this.privateKey = readFileSync(
      join(process.cwd(), 'secrets', 'private.pem'),
    );
    this.publicKey = readFileSync(join(process.cwd(), 'secrets', 'public.pem'));
  }

  async login(login: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { login },
      include: { permissions: true },
    });
    if (!user) throw new HttpException('Login or password is incorrect', 401);

    if (!(await bcrypt.compare(password, user.password)))
      throw new HttpException('Login or password is incorrect', 401);

    return jwt.sign(
      {
        user: {
          user_id: user.id,
          login: user.login,
          permissions_mask: user.permissions.reduce(
            (acc, perm) => acc | (1 << perm.permission_id),
            0,
          ),
        },
        token_id: uuidv4(),
      },
      this.privateKey,
      {
        algorithm: 'RS256',
      },
    );
  }

  async verify(token: string): Promise<JWTPayload | null> {
    try {
      return jwt.verify(token, this.publicKey) as JWTPayload;
    } catch {
      return null;
    }
  }
}
