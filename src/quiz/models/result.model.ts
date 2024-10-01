import { Table, Column, DataType, Model, PrimaryKey, AllowNull, Unique } from "sequelize-typescript";

@Table({ tableName: 'results' })
export class Result extends Model<Result> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    })
    id: number;

    @Unique('results_quiz_id_user_id')
    @Column({
        type: DataType.INTEGER,
        field: 'quiz_id',
        allowNull: false
    })
    quizId: number;

    @Unique('results_quiz_id_user_id')
    @Column({
        type: DataType.INTEGER,
        field: 'user_id',
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.INTEGER,
        field: 'score',
        allowNull: false
    })
    score: number;  

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