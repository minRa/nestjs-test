import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../board.types';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('metadata', metadata);
    if (typeof value === 'string') {
      value = value.toUpperCase();
      if (this.isStatusValid(value)) return value;
      throw new BadRequestException(
        `${value}  is not a one of options for the status `,
      );
    } else {
      throw new BadRequestException(`${value} is not type of string `);
    }
  }

  private isStatusValid(status: BoardStatus) {
    if (typeof status === 'string') {
      const index = this.StatusOptions.indexOf(status);
      return index !== -1;
    }
  }
}
