import { IsString } from "class-validator";

export class CreateMultisigDto {

    @IsString()
    signature: string

    @IsString()
    walletAddress: string

    @IsString()
    projectId: string
}
