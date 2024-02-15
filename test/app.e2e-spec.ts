import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { SkillAddDto, SkillEditDto } from 'src/skill/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.teardownDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const authDto: AuthDto = {
      email: 'test@user.mock',
      password: '123456',
    };

    describe('Sign up', () => {
      it('should return an error if the email is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: authDto.password })
          .expectStatus(400);
      });

      it('should return an error if the password is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: authDto.email })
          .expectStatus(400);
      });

      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(201);
      });

      it('should return an error if the user already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(403);
      });
    });

    describe('Login', () => {
      it('should return an error if the email is missing', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: authDto.password })
          .expectStatus(400);
      });

      it('should return an error if the password is missing', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: authDto.email })
          .expectStatus(400);
      });

      it('should return an error if the user does not exists', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...authDto, email: 'non-existent@user.test' })
          .expectStatus(403);
      });

      it('should return an error if the password does not match', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...authDto, password: 'incorrect-pasword' })
          .expectStatus(403);
      });

      it('should login an existing user', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(authDto)
          .expectStatus(200)
          .stores('token', 'token');
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('should return an error without an authorization token', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('should return the current logged in user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{token}')
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit the current logged in user', () => {
        const userEditDto = {
          email: 'edited@user.test',
          firstName: 'Edited',
          lastName: 'User',
          password: '1234567890',
        };

        return pactum
          .spec()
          .patch('/users/me')
          .withBearerToken('$S{token}')
          .withBody(userEditDto)
          .expectStatus(200)
          .expectBodyContains(userEditDto.firstName)
          .expectBodyContains(userEditDto.lastName)
          .expectBodyContains(userEditDto.email);
      });
    });
  });

  describe('Skill', () => {
    describe('Get skills', () => {
      it('should return an empty array when the skill list is empty', () => {
        return pactum
          .spec()
          .get('/skills')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Add skill', () => {
      it('should add a new skill', () => {
        const skillAddDto: SkillAddDto = {
          name: 'js',
          description: 'javascript',
          link: 'https://learn.js',
        };
        return pactum
          .spec()
          .post('/skills')
          .withBearerToken('$S{token}')
          .withBody(skillAddDto)
          .expectStatus(201)
          .expectBodyContains('id')
          .expectBodyContains(skillAddDto.name)
          .expectBodyContains(skillAddDto.description)
          .expectBodyContains(skillAddDto.link)
          .stores('skillId', 'id');
      });
    });
    describe('Get skills', () => {
      it('should return a list of skills when it is not empty', () => {
        return pactum
          .spec()
          .get('/skills')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get skill', () => {
      it('should return the skill corresponding to an ID', () => {
        return pactum
          .spec()
          .get('/skills/{skillId}')
          .withPathParams('skillId', '$S{skillId}')
          .withBearerToken('$S{token}')
          .expectStatus(200);
      });
    });
    describe('Edit skill', () => {
      it('should edit the skill and return the updated skill', () => {
        const skillEditDto: SkillEditDto = {
          name: 'py',
          description: 'python',
          link: 'https://python.net',
        };
        return pactum
          .spec()
          .patch('/skills/{skillId}')
          .withPathParams('skillId', '$S{skillId}')
          .withBody(skillEditDto)
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectBodyContains('$S{skillId}');
      });
    });
    describe('Delete skill', () => {
      it('should delete the skill', () => {
        return pactum
          .spec()
          .delete('/skills/{skillId}')
          .withPathParams('skillId', '$S{skillId}')
          .withBearerToken('$S{token}')
          .expectStatus(204);
      });
    });
  });
});
