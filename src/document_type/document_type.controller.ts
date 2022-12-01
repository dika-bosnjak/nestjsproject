import { Body, Controller, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DocumentTypeService } from '@app/document_type/document_type.service';
import { DocumentType } from '@app/document_type/entity/document_type.entity';
import { DocumentTypeDto } from './dto';

@ApiTags('document-type')
@Controller('document-type')
export class DocumentTypeController {
    constructor(private documentTypeService: DocumentTypeService){}

    @ApiOkResponse({type: DocumentType, isArray: true})
    @Get('')
    getDocumentTypes(): any {
        return this.documentTypeService.getAll()
    }

    @ApiCreatedResponse({type: DocumentType})
    @Post('')
    createDocumetType(@Body(new ValidationPipe()) dto: DocumentTypeDto) {
        return this.documentTypeService.createDocumentType(dto);
    }

    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({type: DocumentType, isArray: false})
    @Get(':id')
    getDocumentTypeById(@Param('id') id: ParseIntPipe): any {
        return this.documentTypeService.getDocumentTypeById(Number(id))
    }


}
