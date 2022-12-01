import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class DocumentType {
    @ApiProperty({
        default: "Last Will and Testament"
    })
    name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({
        default: "{\"title\": \"Last Will and Testament Survey\"}"
    })
    content: Prisma.JsonValue;

}