
// interfaz para get,put,delete
export interface Ieventos{ 
    id:string;
    nombre:string;
    fecha:string;
    lugar:string;
    descripcion:string;
    aforo: number;
    imagen:string;
}

//Interfaz para post
export interface Ievento{ 
    nombre:string;
    fecha:string;
    lugar:string;
    descripcion:string;
    aforo: number;
    imagen:string;
}


export interface Asistente {
    id: string;           // Identificador único del asistente
    idevento:string
    nombre: string;       // Nombre del evento
    fecha: string;        // Fecha del registro en formato ISO
    username: string;      
    email: string;        // Correo electrónico del asistente

  }
  
  


