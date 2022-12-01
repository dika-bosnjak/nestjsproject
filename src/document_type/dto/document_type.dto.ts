import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString, IsJSON } from "class-validator";

export class DocumentTypeDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    content: Prisma.InputJsonValue;
}