export interface ErrorInterface<T> {
    message?: string;
    code: number;
    status: boolean;
    data: T | null;
}
