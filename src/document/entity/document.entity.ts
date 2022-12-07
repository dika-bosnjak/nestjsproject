import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DocumentType } from '@app/document_type/entity/document_type.entity';
import { User } from '@app/user/entity/user.entity';

export class Document {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  author: User;

  @ApiProperty()
  documentTypeId: number;

  @ApiProperty()
  documentType: DocumentType;

  @ApiProperty()
  content: Prisma.JsonValue;

  @ApiProperty()
  isCompleted: boolean;
}
