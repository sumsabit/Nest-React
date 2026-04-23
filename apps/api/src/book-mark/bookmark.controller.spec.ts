import { Test, TestingModule } from '@nestjs/testing';
import { BookMarkController } from './bookmark.controller';

describe('BookMarkController', () => {
  let controller: BookMarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookMarkController],
    }).compile();

    controller = module.get<BookMarkController>(BookMarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
