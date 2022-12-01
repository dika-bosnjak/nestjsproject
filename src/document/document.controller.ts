import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DocumentService } from '@app/document/document.service';
import { DocumentDto } from '@app/document/dto';
import { Document } from '@app/document/entity/document.entity';
import { GetUser } from '@app/user/decorator';

import { User } from '@app/user/entity/user.entity';
import { JwtGuard } from '@app/user/guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('document')
@Controller('document')
export class DocumentController {
    constructor(private documentService: DocumentService){}


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


    @ApiOkResponse({type: Document, isArray: true})
    @Get(':id')
    getDocumentById(@GetUser('') user: User, @Param('id') id: ParseIntPipe) {
        return this.documentService.getDocumentById(Number(user.id), Number(id))
    }

    @ApiOkResponse({type: Document, isArray: true})
    @Patch(':id')
    updateDocument(@GetUser('') user: User, @Param('id') id: ParseIntPipe, @Body(new ValidationPipe()) dto: DocumentDto ) {
        return this.documentService.updateDocument(Number(user.id), Number(id), dto)
    }

}
