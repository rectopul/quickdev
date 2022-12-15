import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthenticateDTO } from './authenticate.dto';
import { AuthenticateService } from './authenticate.service';

@Controller('api/authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
    async create(@Body() data: AuthenticateDTO) {
      try {
        return await this.authenticateService.generateToken(data)
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST, {
          cause: error
        });
      }
        
    }
}
