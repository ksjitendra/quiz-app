import { Table, Column, DataType, Model, PrimaryKey, AllowNull } from "sequelize-typescript";

@Table({ tableName: 'answers' })
export class Answer extends Model<Answer> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
        field: 'question_id',
        allowNull: false
    })
    questionId: number;

    @Column({
        type: DataType.INTEGER,
        field: 'selected_option',
        allowNull: false
    })
    selectedOption: number;

    @Column({
        type: DataType.BOOLEAN,
        field: 'is_correct',
        allowNull: false
    })
    isCorrect: Boolean;  

    @Column({
        type: DataType.INTEGER,
        field: 'user_id',
        allowNull: false
    })
    userId: number;

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