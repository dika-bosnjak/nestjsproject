import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from '@app/user/guard';
import { GetUser } from '@app/user/decorator';
import { UserService } from '@app/user/user.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth, ApiParam, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from '@app/user/entity/user.entity';
import { Token } from '@app/user/entity/token.entity';
import { AuthDto, UserDto } from '@app/user/dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Incorrect credentials',
      },
    },
    description: '404. NotFoundException. User was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Incorrect credentials',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiOkResponse({
    type: Token,
    description: '200. Success.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body(new ValidationPipe()) dto: AuthDto): Promise<{ access_token: string }> {
    return this.userService.login(dto);
  }

  @ApiCreatedResponse({ type: User })
  @Post('signup')
  signup(@Body(new ValidationPipe()) dto: UserDto) {
    return this.userService.signup(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: false })
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: false })
  @UseGuards(JwtGuard)
  @Patch('me')
  updateProfile(@GetUser('') user: User, @Body() updateUserDto: UserDto) {
    return this.userService.updateProfile(Number(user.id), updateUserDto);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: User, isArray: false })
  @Get(':id')
  getUserById(@Param('id') id: ParseIntPipe): any {
    return this.userService.getUserById(Number(id));
  }

  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  getUsers(): any {
    return this.userService.getUsers();
  }
}
