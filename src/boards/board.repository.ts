import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Board } from './board.entity';
import { BoardStatus } from './board.types';
import { CreateBoardDto } from './DTO/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async getBoardById(id: number): Promise<Board> {
    const board = await this.findOne({ where: { id } });
    if (!board) {
      throw new NotFoundException(`Can't find Board with id: ${id}`);
    }
    return board;
  }
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = await this.create({
      ...createBoardDto,
      status: BoardStatus.PUBLIC,
      user,
    });
    await this.save(board);
    return board;
  }
}
