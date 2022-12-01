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
    
    async login (dto: AuthDto) : Promise<{access_token: string}> {
        //find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        //if user does not exists throw err
        if (!user) throw new ForbiddenException('Incorrect credentials')

        //compare passwords
        const pwMatches = await argon.verify(user.password, dto.password)

        //if password incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException('Incorrect credentials')
        }

        //send back the user token
        return this.signToken(user.id, user.email);
    }


    async signToken(userId: number, email: string): Promise<{access_token: string}>{
        //prepare data for the token
        const payload = {
            sub: userId, 
            email: email
        }

        //get the secret from the .env file
        const secret = this.config.get("JWT_SECRET");

        //assign the token to the user
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret
        })

        //return the access token as the response
        return {
            access_token: token,
        }
    }


    async signup(dto: UserDto) {
        //generate the password hash
        const hash = await argon.hash(dto.password);

        try{
        //save the new user in the db
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
                zip: dto.zip
            },
        })
        //remove the password from the user that is returned in the response
        delete user.password;
        //return the saved user
        return user;
        } catch (err) {
            //if the user email is already taken, return the error message
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code = 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            //if there is any other error, display it
            throw err;
        }
    }

    async getUserById(id: number): Promise<User>{
        //get the user by the id
        if (id) {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: id
                }
            })
            //if user does not exists throw err
            if (!user) throw new NotFoundException
            //remove the password from the user that is returned in the response
            delete user.password;
            return user
        }

        throw new BadRequestException


    }

    async getUsers(firstName?: string): Promise<User[]>{
        let users
        //get all users from the db
        if (firstName){
            users = await this.prisma.user.findMany({
                where: {
                    firstName: firstName
                },
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
                    zip: true
                }
            })
        } else {
            users = await this.prisma.user.findMany({
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
                    zip: true
                }
            })
        }

        //if there are no users, throw an error
        if (!users) throw new NotFoundException
        return users
    }

    async updateProfile(userId:number, dto: UserDto) {
        //update the user in the db
        const user = await this.prisma.user.update({
            where: {
                id: userId
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
                email: dto.email
            }
        })
        //if user does not exists throw err
        if (!user) throw new NotFoundException
        delete user.password
        return user
    }

    
}
