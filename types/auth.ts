interface ApiResult {
    success: boolean;
    message: string;
    statusCode: number;
    error?: string;
    data?: unknown;
}

export { type ApiResult }