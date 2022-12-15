import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Patch, 
  Param, 
  Delete, 
  Res, 
  HttpException, 
  HttpStatus, 
  UseInterceptors,
  UploadedFile,
  Headers 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/config/multer.config';
import { UserImageDTO } from './dto/create-user-image.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserDTO) {

    try {
      return await this.usersService.create(data)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async image(
    @UploadedFile() file: Express.Multer.File,
    @Body() CreateImageDTO: UserImageDTO,
    @Headers() Headers,
  ) {
    try {
      CreateImageDTO.name = file.filename

      return await this.usersService.image(CreateImageDTO, Headers)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Put('image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateImageDTO: UserImageDTO,
    @Headers() Headers,
  ) {
    try {
      updateImageDTO.name = file.filename

      return await this.usersService.updateImage(updateImageDTO, Headers)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UserDTO, @Headers() Headers) {
    try {
      return this.usersService.update(+id, updateUserDto, Headers);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
