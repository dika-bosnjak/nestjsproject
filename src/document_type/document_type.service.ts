import { PrismaService } from '@app/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@app/document_type/entity/document_type.entity';
import { DocumentTypeDto } from '@app/document_type/dto';

@Injectable()
export class DocumentTypeService {
    constructor(private prisma: PrismaService) {}

    async getAll(): Promise<DocumentType[]>{
        
        const documentTypes = await this.prisma.documentType.findMany()


        //if there are no document types, throw an error
        if (!documentTypes) throw new NotFoundException
        return documentTypes
    }

    async createDocumentType(dto: DocumentTypeDto) {
        try{
        //save the new document type in the db
        const document_type = await this.prisma.documentType.create({
            data: {
                name: dto.name,
                content: JSON.parse(String(dto.content)),
            },
        })
        //return the saved document type
        return document_type;
        } catch (err) {
            //if there is any other error, display it
            throw err;
        }
    }

    async getDocumentTypeById(id: number) {
         //get the document type by the id
         if (id) {
            const documentType = await this.prisma.documentType.findFirst({
                where: {
                    id: id
                }
            })
            //if document type does not exists throw err
            if (!documentType) throw new NotFoundException
            return documentType
        }

        throw new BadRequestException
    }

}
