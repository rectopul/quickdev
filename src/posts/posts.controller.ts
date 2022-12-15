import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Put,
  Param, 
  Delete, 
  Headers, 
  HttpException, 
  HttpStatus, 
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Authorization } from 'src/modules/auth.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostImageDTO } from './dto/create-post-image.dto';
import { multerOptions } from 'src/config/multer.config';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private authorization: Authorization) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Headers() headers) {

    try {

      return await this.postsService.create(createPostDto, headers);


    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    
  }

  @Post('image/:post_id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async image(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createImagePostDTO: PostImageDTO,
    @Headers() headers,
    @Param() params
    ){
    
    try {

      createImagePostDTO.name = file.filename
      createImagePostDTO.post_id = parseInt(params.post_id)

      return await this.postsService.createImage(createImagePostDTO, headers)
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  @Put('image/:post_id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateImage(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createImagePostDTO: PostImageDTO,
    @Headers() headers,
    @Param() params
    ){
    
    try {

      createImagePostDTO.name = file.filename
      createImagePostDTO.post_id = parseInt(params.post_id)

      return await this.postsService.updateImage(createImagePostDTO, headers)
      
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('info')
  async postInfo(@Headers() headers) {
    try {
      
      return this.postsService.info(headers);
    } catch (error) {
      
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto, @Headers() headers: any,) {
    return this.postsService.update(+id, updatePostDto, headers);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers() headers: any,) {
    return this.postsService.remove(+id, headers);
  }
}
