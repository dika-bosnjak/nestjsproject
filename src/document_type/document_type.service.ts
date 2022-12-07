import { PrismaService } from '@app/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@app/document_type/entity/document_type.entity';
import { DocumentTypeDto } from '@app/document_type/dto';

@Injectable()
export class DocumentTypeService {
  constructor(private prisma: PrismaService) {}

  //getAll function return the array of document types
  async getAll(): Promise<DocumentType[]> {
    const documentTypes = await this.prisma.documentType.findMany();
    if (!documentTypes) throw new NotFoundException();
    return documentTypes;
  }

  //createDocumentType creates a new document type in the database and returns the document type info
  async createDocumentType(dto: DocumentTypeDto): Promise<DocumentType> {
    try {
      const documentType = await this.prisma.documentType.create({
        data: {
          name: dto.name,
          content: JSON.parse(String(dto.content)),
        },
      });
      return documentType;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  //getDocumentTypeById finds the document type in the database and returns the document type
  async getDocumentTypeById(id: number): Promise<DocumentType> {
    if (id) {
      const documentType = await this.prisma.documentType.findFirst({
        where: {
          id: id,
        },
      });
      //if document type does not exists throw err
      if (!documentType) throw new NotFoundException();
      return documentType;
    }
    throw new BadRequestException();
  }
}
