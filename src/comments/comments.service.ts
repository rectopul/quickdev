import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { Authorization } from 'src/modules/auth.service';
import { CommentDTO } from './comments.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService, private authorization: Authorization){}


  async create(createCommentDto: CommentDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(createCommentDto).length === 0) {
        throw new Error(`please send data`)
      }

      createCommentDto.user_id = user.id
      createCommentDto.active = true

      const post = await this.prisma.post.findFirst({where: {id: createCommentDto.post_id }, include: { user: true}})
      
      if(!post) throw new Error("Post not exist");

      const comment = await this.prisma.comment.create({ data: createCommentDto })

      return comment
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: CommentDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(updateCommentDto).length === 0) {
        throw new Error(`please send data`)
      }

      const comment  = await this.prisma.comment.findFirst({ where: { id }, include: { user: true }})

      if(comment.user.id !== user.id) throw new Error(`Don't have permission from this action`)

      delete updateCommentDto.user_id

      const updateComment = await this.prisma.comment.update({ where: {id}, data: updateCommentDto})

      return updateComment
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  async remove(id: number, headers) {
    try {
      
      const user = await this.authorization.checkToken(headers?.authorization)
  
      if(!user) throw new Error("Token not valid");
  
      const comment = await this.prisma.comment.findFirst({ where: {id}, include: { post: { include: { user: true }}, user: true}})
  
      let owner = `owner`
  
      console.log(`id dono do comentario: `, comment.user.id)
  
      if(!comment) throw new Error("Comment not exist");
  
      if(user.id !== comment.user.id && user.id !== comment.post.user_id) 
        throw new Error("Dont have permission from remove this comment")
  
      if(user.id === comment.post.user_id) owner = `ownerPost`
  
      const removeComment = await this.prisma.comment.update({ 
        where: { id },
        data: {
          active: false,
          user_remove: owner
        }
      })
  
      return removeComment
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}
