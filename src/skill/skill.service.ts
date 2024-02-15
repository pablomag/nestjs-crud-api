import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SkillAddDto, SkillEditDto } from './dto';
import { handleError } from '../common/error.service';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  getSkills(userId: number) {
    return this.prisma.skill.findMany({
      where: {
        userId,
      },
    });
  }

  async getSkill(userId: number, skillId: number) {
    try {
      return await this.prisma.skill.findFirstOrThrow({
        where: {
          id: skillId,
          userId,
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async addSkill(userId: number, skillAddDto: SkillAddDto) {
    return await this.prisma.skill.create({
      data: {
        userId,
        ...skillAddDto,
      },
    });
  }

  async editSkill(userId: number, skillId: number, skillEditDto: SkillEditDto) {
    try {
      return await this.prisma.skill.findUniqueOrThrow({
        where: {
          id: skillId,
          userId,
        },
      });
    } catch (error) {
      handleError(error);
    }

    return await this.prisma.skill.update({
      where: {
        id: skillId,
        userId,
      },
      data: {
        ...skillEditDto,
      },
    });
  }

  async deleteSkill(userId: number, skillId: number) {
    try {
      await this.prisma.skill.findUniqueOrThrow({
        where: {
          id: skillId,
          userId,
        },
      });
    } catch (error) {
      handleError(error);
    }

    return await this.prisma.skill.delete({
      where: {
        id: skillId,
        userId,
      },
    });
  }
}
