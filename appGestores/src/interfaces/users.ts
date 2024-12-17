export interface Users{
    id:number;
    username:string;
    email:string;
    password:string;
    nombres:string;
    apellidos:string;
    telefono:number;
    rut: string;
    imagen: string;

    isactive: boolean;
}

export interface UserNuevo{
    id:number;
    username:string;
    email:string;
    password:string;
    nombres:string;
    apellidos:string;
    telefono:number;
    rut: string;
    imagen: string;

    isactive: boolean;
}