import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from 'src/modules/auth.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { LikeDTO } from './like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService, private authorization: Authorization){}

  async create(createLikeDto: LikeDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(createLikeDto).length === 0) {
        throw new Error(`please send data`)
      }

      createLikeDto.user_id = user.id

      const like = await this.prisma.like.create({ data:  createLikeDto})

      return like
    } catch (error) {
      throw new Error(error?.message)
    }
    
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  async update(id: number, updateLikeDto: LikeDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(updateLikeDto).length === 0) {
        throw new Error(`please send data`)
      }

      updateLikeDto.user_id = user.id

      const like = await this.prisma.like.update({ 
        where: {id},
        data:  updateLikeDto
      })

      return like
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
