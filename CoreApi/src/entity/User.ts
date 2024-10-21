import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  @Entity({ name: "users" })
  export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({ nullable: false })
    username!: string;
  
    @Column({ nullable: false })
    email!: string;
  
    @Column({ nullable: false })
    password!: string;
  
    @Column({ default: true})
    isActive!: boolean;
}