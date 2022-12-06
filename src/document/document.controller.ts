import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Res, StreamableFile, UseGuards, ValidationPipe, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DocumentService } from '@app/document/document.service';
import { DocumentDto } from '@app/document/dto';
import { Document } from '@app/document/entity/document.entity';
import { GetUser } from '@app/user/decorator';
import { createReadStream } from 'fs';
import { join } from 'path';

import { User } from '@app/user/entity/user.entity';
import { JwtGuard } from '@app/user/guard';

import { generatePDF } from '@app/pdf-generator/last-will.generator';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('document')
@Controller('document')
export class DocumentController {
    constructor(private documentService: DocumentService){}

    @ApiParam({ name: 'id', type: Number })
    @Header('content-type', 'application/pdf')
    @Header('content-disposition', 'attachment')
    @ApiOkResponse()
    @Get(':id/print')
    async printDocument(@GetUser('') user: User, @Param('id') id: ParseIntPipe) {
       let document = await this.documentService.getDocumentById(Number(user.id), Number(id));
       let fileName = generatePDF(user, document)
       const file = createReadStream(join(process.cwd(), fileName));
       return new StreamableFile(file)
    }

    @ApiOkResponse({type: Document, isArray: true})
    @Get('')
    getDocuments(@GetUser('') user: User) {
        return this.documentService.getAll(Number(user.id))
    }

    @ApiCreatedResponse({type: Document})
    @Post('')
    createDocument(@GetUser('') user: User, @Body(new ValidationPipe()) dto: DocumentDto) {
        return this.documentService.createDocument(Number(user.id), dto);
    }

    @ApiOkResponse({type: Document, isArray: false})
    @Get(':id')
    getDocumentById(@GetUser('') user: User, @Param('id') id: ParseIntPipe) {
        return this.documentService.getDocumentById(Number(user.id), Number(id))
    }

    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse()
    @Delete(':id')
    deleteDocument(@GetUser('') user: User, @Param('id') id: ParseIntPipe) {
        return this.documentService.deleteDocument(Number(user.id), Number(id))
    }

    @ApiOkResponse({type: Document, isArray: true})
    @Patch(':id')
    updateDocument(@GetUser('') user: User, @Param('id') id: ParseIntPipe, @Body(new ValidationPipe()) dto: DocumentDto ) {
        return this.documentService.updateDocument(Number(user.id), Number(id), dto)
    }
}
