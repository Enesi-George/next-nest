import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(id: number, updateData: Partial<CreateUserDto>): Promise<Omit<User, 'password'>> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}