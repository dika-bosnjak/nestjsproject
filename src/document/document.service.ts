import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DocumentDto } from '@app/document/dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Document } from '@app/document/entity/document.entity';

@Injectable()
export class DocumentService {
    constructor(private prisma: PrismaService) {}

    async getAll(id: number){
        
        const documents= await this.prisma.document.findMany({
            where: {
                authorId: id,
            },
            include: {
                documentType: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                author: {
                    select: {
                        id:true,
                        firstName: true,
                        lastName: true
                    }
                }
              },
        })


        //if there are no documents, throw an error
        if (!documents) throw new NotFoundException
        return documents
    }

    async getDocumentById(authorId: number, id: number) {

        //check if the logged in user is the author of the document
        const isAuthor = await this.checkAuthor(authorId, id)
        if (!isAuthor) {
            throw new UnauthorizedException
        }

        //get the document from the database
        const document = await this.prisma.document.findFirst({
            where: {
                authorId: authorId,
                id: id,
            },
            include: {
                documentType: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            },
        })
        //if there is no document, throw an error
        if (!document) throw new NotFoundException
        return document
    }

    async deleteDocument(authorId: number, id: number) {

        //check if the logged in user is the author of the document
        const isAuthor = await this.checkAuthor(authorId, id)
        if (!isAuthor) {
            throw new UnauthorizedException
        }

        //delete the document in the database
        await this.prisma.document.delete({
            where: {
                id: id,
            }
        })
        
        return {
            "id": id,
            "message": "Document is deleted successfully."
        }
    }

    async createDocument(authorId: number, dto: DocumentDto) {
        try{
            //save the new document in the db
            const document = await this.prisma.document.create({
                data: {
                    author: {
                        connect: {
                            id: authorId
                        }
                    },
                    documentType: {
                        connect: {
                            id: dto.documentTypeId
                        }
                    },
                    content: JSON.parse(String(dto.content))

                },
            })
            //return the saved document
            return document;
            } catch (err) {
                //if there is any other error, display it
                throw err;
            }
    }

    async updateDocument(authorId: number, documentId: number, dto: DocumentDto) {

        //check if the logged in user is the author of the document
        const isAuthor = this.checkAuthor(authorId, documentId)
        if (!isAuthor) {
            throw new UnauthorizedException
        }

        //update the document in the db
        const document = await this.prisma.document.update({
            where: {
                id: documentId
            },
            data: {
                content: JSON.parse(String(dto.content))
            }
        })
        //if user does not exists throw err
        if (!document) throw new NotFoundException
        return document
    }

    async checkAuthor(authorId: number, id: number) {
        const document = await this.prisma.document.findFirst({
            where: {
                authorId: authorId,
                id: id,
            },
        })
        //if there is no document, throw an error
        if (!document) return 0
        else { return 1 }
    }

}
