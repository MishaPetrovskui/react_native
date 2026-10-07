export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  salt: string;
  passwordHash: string;
}

/** Користувач без секретних полів — його бачать екрани. */
export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  /** YYYY-MM-DD або null, якщо дедлайну немає */
  deadline: string | null;
  /** URI зображення (на web — data URI) або null */
  imageUri: string | null;
  done: boolean;
  /** ISO-рядок */
  createdAt: string;
}

export type TodoInput = Pick<Todo, 'title' | 'description' | 'deadline' | 'imageUri'>;
