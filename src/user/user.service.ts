import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthDto, UserDto } from '@app/user/dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User } from '@app/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  //login function gets the user from the database, verifies the password, and returns the access token
  async login(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect credentials');

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Incorrect credentials');

    return this.signToken(user.id, user.email);
  }

  //signToken function gets userId and email, creates and returns the token
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  //signup function creates a new user in the database and returns the user
  async signup(dto: UserDto): Promise<User> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          gender: dto.gender,
          phone: dto.phone,
          county: dto.county,
          street: dto.street,
          apartment: dto.apartment,
          city: dto.city,
          state: dto.state,
          zip: dto.zip,
        },
      });
      delete user.password;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if ((err.code = 'P2002')) {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }

  //getUserById finds the user in the database and returns the user data
  async getUserById(id: number): Promise<User> {
    if (id) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!user) throw new NotFoundException();
      delete user.password;
      return user;
    }
    throw new BadRequestException();
  }

  //getUsers function gets all users from the database and returns array of users
  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        middleName: true,
        gender: true,
        county: true,
        street: true,
        apartment: true,
        city: true,
        state: true,
        zip: true,
        phone: true,
      },
    });
    if (!users) throw new NotFoundException();
    return users;
  }

  //updateProfile function updates the user info in the database and returns the user
  async updateProfile(userId: number, dto: UserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        gender: dto.gender,
        phone: dto.phone,
        county: dto.county,
        street: dto.street,
        apartment: dto.apartment,
        city: dto.city,
        state: dto.state,
        zip: dto.zip,
      },
    });
    if (!user) throw new NotFoundException();
    delete user.password;
    return user;
  }
}
