import { Request, Response } from 'express';
import crypto from 'crypto';

export class AuthController {
  public static login(req: Request, res: Response) {
    const { username = 'admin', password } = req.body || {};
    const validUsers: Record<string, string> = {
      admin: '1111',
      manager: '1111',
      guest: '1111',
    };

    // If password provided and does not match demo dictionary
    if (password && validUsers[username] && validUsers[username] !== password) {
      return res.status(401).json({ detail: 'Invalid username or password' });
    }

    const role = (username.toLowerCase().includes('guest') ? 'guest' : username.toLowerCase().includes('manager') ? 'manager' : 'admin');
    const token = `demo-token-${username}-${Date.now()}`;
    const refreshToken = `demo-refresh-${username}-${Date.now()}`;
    const name = role === 'admin' ? '최고 관리자' : role === 'manager' ? '운영 매니저' : '게스트 사용자';

    return res.json({
      // Modern standards
      access_token: token,
      token_type: 'bearer',
      user: {
        username,
        role,
        name,
        permissions: role === 'admin' ? ['*'] : role === 'manager' ? ['read', 'write'] : ['read']
      },
      // Backward-compatible fields for legacy vanilla JS
      token,
      accessToken: token,
      refreshToken,
      username,
      name,
    });
  }

  public static refresh(req: Request, res: Response) {
    const { refreshToken } = req.body || {};
    if (!refreshToken && req.headers.authorization === undefined) {
      return res.status(401).json({ detail: 'Missing refresh token' });
    }

    const token = `refreshed-token-${Date.now()}`;
    const newRefresh = `demo-refresh-${Date.now()}`;

    return res.json({
      access_token: token,
      token_type: 'bearer',
      token,
      accessToken: token,
      refreshToken: newRefresh,
      username: 'admin',
      name: 'Administrator',
    });
  }

  public static getProtected(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ detail: 'Missing Authorization header' });
    }
    return res.json({
      status: 'authenticated',
      message: 'Access granted to enterprise secure resource',
      user: (req as any).user || { username: 'admin', role: 'admin' },
      timestamp: new Date().toISOString()
    });
  }
}
