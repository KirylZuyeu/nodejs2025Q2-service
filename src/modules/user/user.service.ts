import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserResponse } from '../../common/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
      },
    });

    const { password, ...userResponse } = user;
    return {
      ...userResponse,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async getAllUsers(): Promise<IUserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      const { password, ...userResponse } = user;
      return {
        ...userResponse,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    });
  }

  async getUserById(id: string): Promise<IUserResponse> {
    if (!validateUuid(id)) {
      throw new BadRequestException('User Id is invalid (not uuid)');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userResponse } = user;
    return {
      ...userResponse,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async updateUser(id: string, updatePasswordDto: UpdatePasswordDto): Promise<IUserResponse> {
    if (!validateUuid(id)) {
      throw new BadRequestException('User Id is invalid (not uuid)');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    const { password, ...userResponse } = updatedUser;
    return {
      ...userResponse,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async deleteUser(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException('User Id is invalid (not uuid)');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
