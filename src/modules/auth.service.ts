import * as jwt from 'jsonwebtoken'
import { PrismaService } from 'src/database/PrismaService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Authorization {

    constructor(private prisma: PrismaService){}

    async checkToken(token: String) {
        try {
            
            const [,tk] = token.split(' ') 
            
            const { id } = await jwt.verify(tk, process.env.APP_SECRET)

            const user = await this.prisma.user.findUnique({where: {
                id: id
            }})


            if(!user) throw new Error("Token not found");

            delete user.password_hash

            return user
            
        } catch (error) {
            console.log(`Error auth: `, error)
            throw new Error(error?.message)
        }
    }
}