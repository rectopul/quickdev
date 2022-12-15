import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt'
import { UserImageDTO } from './dto/create-user-image.dto';
import { Authorization } from 'src/modules/auth.service';
import * as fs from 'fs'
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService, private authorization: Authorization){}

  async image(createUserImageDTO: UserImageDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(createUserImageDTO).length === 0) {
        throw new Error(`please send data`)
      }

      const userImage = await this.prisma.userImage.findFirst({ where: { user_id: user.id }})

      if(userImage) throw new Error(`Already exist image from this user, please update this image`)

      const image = await this.prisma.userImage.create({
        data: {
          user_id: user.id,
          name: createUserImageDTO.name
        }
      })

      if(!image) throw new Error("Error in create new image")

      return image
      
    } catch (error) {
      if(error?.code == `P2002`) throw new Error(`data already exist. Target: ${error?.meta?.target}`)

      throw new Error(error?.message)
    }
  }

  async updateImage(updateUserImageDTO: UserImageDTO, headers: any) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(updateUserImageDTO).length === 0) {
        throw new Error(`please send data`)
      }

      const image = await this.prisma.userImage.findUnique({ where: { user_id: user.id }})

      console.log(`image remove: `, image.name)
      console.log(`New image: `, updateUserImageDTO.name)

      //Test
      if(image) {
        await fs.unlink(`./uploads/${image.name}`, (err: any) => {
          if (err) {
            console.error(err);
            throw new Error(err)
           }
        })
      }

      const updateImage = await this.prisma.userImage.update({
        where: { user_id: user.id},
        data: { name: updateUserImageDTO.name}
      })

      if(!updateImage) throw new Error("Error in update new image")

      delete user.password_hash

      return {
        user,
        updateImage
      }
      
    } catch (error) {
      console.log(`Error update image`, error)
      if(error?.code == `P2002`) throw new Error(`data already exist. Target: ${error?.meta?.target}`)

      throw new Error(error?.message)
    }
  }

  async create(data: UserDTO) {
    try {

      if(Object.keys(data).length === 0) {
        throw new Error(`please send data`)
      }
      
      data.password_hash = await bcrypt.hash(data.password, 8)

      delete data.password

      const user = await this.prisma.user.create({data})

      return user;
    } catch (error) {
      console.log(`error received: `, error)

      if(error?.code == `P2002`) throw new Error(`data already exist. Target: ${error?.meta?.target}`)

      throw new Error(error)
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: User, headers) {
    try {
      const user = await this.authorization.checkToken(headers?.authorization)

      if(!user) throw new Error("Token not valid");

      if(Object.keys(updateUserDto).length === 0) {
        throw new Error(`please send data`)
      }

      const updateUser = await this.prisma.user.update({ where: {id}, data: updateUserDto})

      return updateUser
      
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
