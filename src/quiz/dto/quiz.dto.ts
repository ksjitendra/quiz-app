import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsInt, Min, ArrayNotEmpty, IsArray, ArrayMinSize, Max } from 'class-validator'
import { Type } from 'class-transformer';


export class addQuizDto {

    @ApiProperty()  
    @IsString()
    @IsNotEmpty()
    title: string
}

export class addQuestionDto {

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quizId: number;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    questionTitle: string; 

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty() // Ensures the array is not empty
    @ArrayMinSize(4) // Ensures there are at least 2 options
    @IsString({ each: true }) // Ensures each item in the array is a string
    options: string[];


    @ApiProperty()
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    @Max(3)
    correctOption : number;
}

export class saveAnswerDto{

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    questionId: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    @Max(3)
    selectedOption : number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    userId : number;
}

export class ResultDto{
    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    quizId: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    userId: number;

}