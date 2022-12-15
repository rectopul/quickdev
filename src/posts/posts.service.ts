import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Authorization } from 'src/modules/auth.service';
import { PostImageDTO } from './dto/create-post-image.dto';
import * as fs from 'fs'
import e from 'express';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private authorization: Authorization){}

  async updateImage(data: PostImageDTO, authheader: any) {
    try {
      const user = await this.authorization.checkToken(authheader?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(data).length === 0) {
        throw new Error(`please send data`)
      }

      const post = await this.prisma.post.findFirst({where: {id: data.post_id}, include: { user: true}})

      if(post.user.id !== user.id) throw new Error("You do not have permission to edit this post.")

      const image = await this.prisma.postImage.findFirst({ where: {post_id: post.id }})

      if(image) {
        await fs.unlink(`./uploads/${image.name}`, (err: any) => {
          if (err) {
            console.error(err);
            throw new Error(err)
           }
        })
      }

      const updateImage = await this.prisma.postImage.update({
        where: {
          id: image.id
        },
        data: {
          name: data.name
        }
      })

      if(!image) throw new Error("Error in create new image")

      return {
        post,
        image: updateImage
      }

    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  async createImage(data: PostImageDTO, authheader: any) {
    try {
      const user = await this.authorization.checkToken(authheader?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(data).length === 0) {
        throw new Error(`please send data`)
      }

      //check if already exist image
      const postImage = this.prisma.postImage.findFirst({ where: { post_id: data.post_id }})

      if(postImage) throw new Error(`Already exist image from this post, please update this image`)

      const post = await this.prisma.post.findFirst({where: {id: data.post_id}, include: { user: true}})

      if(post.user.id !== user.id) throw new Error("You do not have permission to edit this post.")

      const image = await this.prisma.postImage.create({data})

      if(!image) throw new Error("Error in create new image")

      return image

    } catch (error) {
      console.log(error)
      throw new Error(error?.message)
    }
  }

  async create(createPostDto: CreatePostDto, authheader) {
    try {
      const user = await this.authorization.checkToken(authheader?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(createPostDto).length === 0) {
        throw new Error(`please send data`)
      }

      const post = await this.prisma.post.create({
        data: {
          user_id: user.id,
          title: createPostDto.title,
          description: createPostDto.description
        }
      })

      if(!post) throw new Error("Error in create new post");
      
      return post

    } catch (error) {
      throw new Error(error?.message)
    }
  }

  async info(headers: any) {
    try {
      
      const posts = await this.prisma.post.findMany({ include: { user: true, PostImage: true, Comment: true, Like: true }})


      const info = []

      posts.map(e => {
        delete e.user.password_hash
        delete e.user.id

        info.push({
          id: e.id,
          title: e.title,
          likes: e.Like.length,
          comments: e.Comment.length
        })
      })

      return info
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async findAll() {
    try {
      
      const posts = await this.prisma.post.findMany({ include: { user: true, PostImage: true, Comment: true, Like: true }})

      posts.map(e => {
        delete e.user.password_hash
        delete e.user.id
      })

      return posts
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: CreatePostDto, headers: any) {
    try {

      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(updatePostDto).length === 0) {
        throw new Error(`please send data`)
      }

      const post = await this.prisma.post.findFirst({where: {id}, include: { user: true}})

      if(post.user.id !== user.id) throw new Error("You do not have permission to edit this post.")


      const updatePost  = await this.prisma.post.update({ 
        where: { id },
        data: updatePostDto
      })

      return updatePost;
    } catch (error) {
      
    }
  }

  async remove(id: number, headers: any) {
    try {

      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      const post = await this.prisma.post.findFirst({where: {id}, include: { user: true, PostImage: true}})

      post.PostImage.map(async e => {
        
        if(e.name) {
          await fs.unlink(`./uploads/${e.name}`, (err: any) => {
            if (err) {
              console.error(err);
              throw new Error(err)
             }
          })
        }

      })

      

      if(post.user.id !== user.id) throw new Error("You do not have permission to remove this post.")

      const deletePost = await this.prisma.post.delete({ where: { id }})

      return deletePost;
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}
