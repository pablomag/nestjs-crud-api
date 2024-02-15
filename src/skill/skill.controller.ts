import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guard';
import { RequestUser } from '../auth/decorator';

import { SkillService } from './skill.service';
import { SkillAddDto, SkillEditDto } from './dto';

@UseGuards(JwtGuard)
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get('/:skillId')
  getSkill(
    @RequestUser(['id']) userId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.skillService.getSkill(userId, skillId);
  }

  @Patch('/:skillId')
  editSkill(
    @RequestUser(['id']) userId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
    @Body() skillEditDto: SkillEditDto,
  ) {
    return this.skillService.editSkill(userId, skillId, skillEditDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:skillId')
  deleteSkill(
    @RequestUser(['id']) userId: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    return this.skillService.deleteSkill(userId, skillId);
  }

  @Get()
  getSkills(@RequestUser(['id']) userId: number) {
    return this.skillService.getSkills(userId);
  }

  @Post()
  addSkill(
    @RequestUser(['id']) userId: number,
    @Body() skillAddDto: SkillAddDto,
  ) {
    return this.skillService.addSkill(userId, skillAddDto);
  }
}
