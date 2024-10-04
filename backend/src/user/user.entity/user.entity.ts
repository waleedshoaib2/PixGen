import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from 'typeorm';

@Entity()
//Using TypeORM to map class properties to db column // marking class as the table

export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    username:string;

    @Column() 
    password:string;

    @Column({unique:true})
    email:string;

    @Column({default:true})
    isActive:boolean;
}
