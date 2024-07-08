import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity
  } from 'typeorm';
  
  @Entity('users')
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    idUsers!: number;
  
    @Column({ type: 'varchar', length: 100 })
    lastName: string;
  
    @Column({ type: 'varchar', length: 100 })
    firstName: string;
  
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;
  
    @Column({ type: 'varchar', length: 255 })
    address: string;
  
    @Column({ type: 'varchar', length: 15 })
    phone: string;
  
    @Column({ type: 'varchar', length: 100 })
    cityName: string;
  
    @Column({ type: 'varchar', length: 255 })
    password: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    uid: string;
  
    @Column({ type: 'boolean', default: false })
    isBotanist: boolean;
  
    @Column({ type: 'float', default: 0 })
    note: number;
  
    @Column({ type: 'boolean', default: false })
    isAdmin: boolean;
  
    @Column({ type: 'boolean', default: false })
    isBan: boolean;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    photoUrl: string;
  
    constructor(
      lastName: string,
      firstName: string,
      email: string,
      address: string,
      phone: string,
      cityName: string,
      password: string,
      uid: string,
      isBotanist: boolean = false,
      note: number = 0,
      isAdmin: boolean = false,
      isBan: boolean = false,
      photoUrl: string = ''
    ) {
      super();
      this.lastName = lastName;
      this.firstName = firstName;
      this.email = email;
      this.address = address;
      this.phone = phone;
      this.cityName = cityName;
      this.password = password;
      this.uid = uid;
      this.isBotanist = isBotanist;
      this.note = note;
      this.isAdmin = isAdmin;
      this.isBan = isBan;
      this.photoUrl = photoUrl;
    }
  }
  