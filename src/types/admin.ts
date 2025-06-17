

// Интерфейс запроса для фильтрации и сортировки пользователей
export interface UserFilters { 
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isBlocked?: boolean;
  limit?: number;  // сколько на странице
  offset?: number;  // страницу
}

// Интерфейс пользователя
export interface User {
  id: number;
  username: string;
  email: string;
  date: string; // ISO date string 
  isBlocked: boolean;
  roles: Roles[]; 
  phoneNumber: string;
}
// Интерфейс метаинформации

export interface MetaResponse<T> { 
  data: T[]
  meta: {   
    totalAmount: number;   
    sortBy: string;   
    sortOrder: 'asc' | 'desc'; 
  }
}
// Интерфейс для обновления прав пользователя
export interface UserRolesRequest {  
  roles: Roles []  // при вызове этой апи роли будут обновлены к тому массиву который будет передан
// например если у вас была roles: ['ADMIN'] а вы хотите добавить ['MODERATOR'] то нужно передавать 
// старые + новые - roles: ['ADMIN', 'MODERATOR'] 
}

// Интерфейс для обновления данных пользователя
export interface UserRequest{  
   username?: string; 
   email?: string; 
   phoneNumber?: string;
}

enum Roles [
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR"
  USER = "USER"
]