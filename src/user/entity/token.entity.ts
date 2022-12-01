import { ApiProperty } from "@nestjs/swagger";

export class Token {
    @ApiProperty({
        default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZGlrYWJvc25qYWtAZ21haWwuY29tIiwiaWF0IjoxNjY5ODAyMzY3LCJleHAiOjE2Njk4MDMyNjd9.kjeXz6Pn0jz3EzGw7ewkJItyM4PQ2iWaWSMrmiTILyY"
    })
    access_token: number;

}