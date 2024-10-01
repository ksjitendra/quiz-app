import { Table, Column, DataType, Model, PrimaryKey, AllowNull } from "sequelize-typescript";

@Table({ tableName: 'questions' })
export class Question extends Model<Question> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    })
    id: number;

    @Column({
        type: DataType.TEXT,
        field: 'question_title',
        allowNull: false
    })
    questionTitle: string;

    @Column({
        type: DataType.JSON,
        field: 'options',
        allowNull: false
    })
    options: string[];

    @Column({
        type: DataType.INTEGER,
        field: 'correct_option',
        allowNull: false
    })
    correctOption: number;  

    @Column({
        type: DataType.DATE,
        field: 'created_at',
        allowNull: false,
    })
    createdAt: Date;
    
    @Column({
        type: DataType.DATE,
        field: 'updated_at',
        allowNull: false,
    })
    updatedAt: Date;
}