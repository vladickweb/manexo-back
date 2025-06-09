import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private oauth2Client: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const clientID = configService.get<string>('config.google.clientId');
    const clientSecret = configService.get<string>(
      'config.google.clientSecret',
    );

    super({
      clientID,
      clientSecret,
      scope: ['email', 'profile'],
      callbackURL: configService.get<string>('config.google.callbackURL'),
    });

    this.oauth2Client = new OAuth2Client(clientID, clientSecret);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;
      const email = emails[0].value;

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = await this.userService.create({
          email,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          password: '',
        });
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }

  async validateToken(token: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('config.google.clientId'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('No payload in token');
      }

      return {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      console.error('Error validating Google token:', error);
      throw error;
    }
  }

  getAuthUrl(redirectUri: string): string {
    return (
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${this.configService.get<string>('config.google.clientId')}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('email profile')}` +
      `&access_type=offline` +
      `&prompt=consent`
    );
  }
}
