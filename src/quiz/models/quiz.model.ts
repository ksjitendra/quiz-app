import { Table, Column, DataType, Model, PrimaryKey } from "sequelize-typescript";

@Table({ tableName: 'quiz' })
export class Quiz extends Model<Quiz> {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        field: 'title',
        allowNull: false
    })
    title: string;

    @Column({
        type: DataType.JSON,
        field: 'questions',
        allowNull: false,
        defaultValue: []
    })
    questions: number[];

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