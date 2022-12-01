import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({
        default:1
    })
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({
        default: "johndoe@gmail.com"
    })
    email:string;

    @ApiProperty({
        default: "John"
    })
    firstName:string;

    @ApiProperty({
        default: "Doe"
    })
    lastName:string;

    @ApiProperty({
        default: "Middle"
    })
    middleName?: string;

    @ApiProperty({
        default: "female"
    })
    gender: string;

    @ApiProperty({
        default: "061123456"
    })
    phone: string;

    @ApiProperty({
        default: "FBIH"
    })
    county: string;

    @ApiProperty({
        default: "Zmaja od Bosne"
    })
    street: string;

    @ApiProperty({
        default: "bb"
    })
    apartment: string;

    @ApiProperty({
        default: "Zenica"
    })
    city: string;

    @ApiProperty({
        default: "BIH"
    })
    state: string;

    @ApiProperty({
        default: "72000"
    })
    zip: string;
}