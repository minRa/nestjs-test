import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTO/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async loginUser(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { username } });
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user) {
      if (passwordValid) {
        // user token gen ( secret + payload)
        const paylod = { username };
        const accessToken = await this.jwtService.sign(paylod);

        return { accessToken };
      } else {
        throw new UnauthorizedException('login failed');
      }
    }
  }
}
