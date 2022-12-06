import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString, IsJSON } from "class-validator";

export class DocumentDto{

    @ApiProperty()
    @IsNotEmpty()
    documentTypeId: number;

    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    content: Prisma.InputJsonValue;

    @ApiProperty()
    @IsNotEmpty()
    isCompleted: boolean;
}