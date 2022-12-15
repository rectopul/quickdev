import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/database/PrismaService'
import { AuthenticateDTO } from './authenticate.dto';

@Injectable()
export class AuthenticateService {
    constructor(private prisma: PrismaService){}

    async checkPassword(data: AuthenticateDTO) {
        try {
            const user  = await this.prisma.user.findFirst({where: {
                email: data.email
            }})

            if(!user) throw new Error(`Not exist user for this ID`)

            const checkPassword = await bcrypt.compare(data.password, user.password_hash)

            if(!checkPassword) throw new Error(`User or Password Not found`)

            return user
        } catch (error) {
            throw new Error(error?.message)
        }
        
    }

    async generateToken(data: AuthenticateDTO) {
        try {
            const user = await this.checkPassword(data)

            if(!user) throw new Error("User or password not found");
            
            const token  = await jwt.sign({
                id: user.id,
            }, process.env.APP_SECRET)

            delete user.password_hash
    
            return {
                user,
                token
            }
        } catch (error) {
            throw new Error(error?.message)
        }
        
    }
}
