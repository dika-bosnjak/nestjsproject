import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DocumentDto } from '@app/document/dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Document } from '@app/document/entity/document.entity';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  //getAll function gets all documents per user and returns the document with the info about document type and author
  async getAll(authorId: number): Promise<{}> {
    const documents = await this.prisma.document.findMany({
      where: {
        authorId: authorId,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      include: {
        documentType: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!documents) throw new NotFoundException('No documents.');
    return documents;
  }

  //getDocumentById function checks whether the user is the author of the document and returns the document from the database with the info about document type and author
  async getDocumentById(authorId: number, documentId: number): Promise<{}> {
    const isAuthor = await this.checkAuthor(authorId, documentId);
    if (!isAuthor) throw new UnauthorizedException('Unauthorized.');

    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
      },
      include: {
        documentType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!document) throw new NotFoundException('Document does not exist.');
    return document;
  }

  //deleteDocument function checks whether the user is the author of the document, deletes the file and returns the document id with the success message
  async deleteDocument(authorId: number, documentId: number): Promise<{ id: number; message: string }> {
    const isAuthor = await this.checkAuthor(authorId, documentId);
    if (!isAuthor) throw new UnauthorizedException('Unauthorized.');

    await this.prisma.document.delete({
      where: {
        id: documentId,
      },
    });
    return {
      id: documentId,
      message: 'Document is deleted successfully.',
    };
  }

  //createDocument function creates the document in the database and returns the document from the database with the info about document type and author
  async createDocument(authorId: number, dto: DocumentDto): Promise<{}> {
    try {
      const document = await this.prisma.document.create({
        data: {
          author: {
            connect: {
              id: authorId,
            },
          },
          documentType: {
            connect: {
              id: dto.documentTypeId,
            },
          },
          content: JSON.parse(String(dto.content)),
          isCompleted: dto.isCompleted,
        },
      });
      return document;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  //updateDocument function updates the document and returns the document from the database with the info about document type and author
  async updateDocument(authorId: number, documentId: number, dto: DocumentDto): Promise<{}> {
    const isAuthor = this.checkAuthor(authorId, documentId);
    if (!isAuthor) throw new UnauthorizedException('Unauthorized.');

    const document = await this.prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        content: JSON.parse(String(dto.content)),
        isCompleted: dto.isCompleted,
      },
    });
    if (!document) throw new BadRequestException('Document could not be updated.');
    return document;
  }

  //checkAuthor function checkes whether the logged in user is the author of the document, returns 1 if the logged in user is the author, otherwise 0
  async checkAuthor(authorId: number, documentId: number): Promise<boolean> {
    const document = await this.prisma.document.findFirst({
      where: {
        authorId: authorId,
        id: documentId,
      },
    });
    if (!document) return false;
    return true;
  }
}
