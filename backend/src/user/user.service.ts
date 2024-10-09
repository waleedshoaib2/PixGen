import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

    async createUser(CreateUserDto:CreateUserDto): Promise<User>{
        const user = this.userRepository.create(CreateUserDto);
        await this.userRepository.save(user);
        return user;
    }

    async findOne(id: number ): Promise<User[]>{
        return await this.userRepository.find()
    }  
    
   async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({id});
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ username });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

}
