import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IUser, IUserResponse } from '../../common/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class UserService {
  private users: IUser[] = [];

  createUser(createUserDto: CreateUserDto): IUserResponse {
    const now = Date.now();
    const user: IUser = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);

    const { password, ...userResponse } = user;
    return userResponse;
  }

  getAllUsers(): IUserResponse[] {
    return this.users.map((user) => {
      const { password, ...userResponse } = user;
      return userResponse;
    });
  }

  getUserById(id: string): IUserResponse {
    if (!validateUuid(id)) {
      throw new BadRequestException('User Id is invalid (not uuid)');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userResponse } = user;
    return userResponse;
  }

  updateUser(id: string, updatePasswordDto: UpdatePasswordDto): IUserResponse {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password, ...userResponse } = user;
    return userResponse;
  }

  deleteUser(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }

}
