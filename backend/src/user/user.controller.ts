import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { Body, Post, Get, Put, Delete, Param} from '@nestjs/common';
import { User } from './user.entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';


@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService){}

    @Post()
    async createUser(@Body() CreateUserDto:CreateUserDto): Promise<User>{
        return this.userService.createUser(CreateUserDto);
    }

    @Get()
    async getUser(@Body() id:number): Promise<User[]>{
        return this.userService.findOne(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User[]> {
      return await this.userService.findOne(id);
    }
  
    @Put(':id')
    async updateUser(
      @Param('id') id: number,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
      return await this.userService.updateUser(id, updateUserDto);
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<void> {
      return await this.userService.deleteUser(id);
    }
  

}
