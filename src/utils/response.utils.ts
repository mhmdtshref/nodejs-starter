import { Response } from "express";

const success = (response: Response, data: { [key: string]: any }, message: string) => response.status(200).json({ data, message });
const notFound = (response: Response, error: string) => response.status(404).json({ error });
const created = (response: Response, data: { [key: string]: any }, message: string) => response.status(201).json({ data, message });
const unauthorized = (response: Response) => response.status(401).json({ error: 'Unauthorized' });
const badRequest = (response: Response, error: string) => response.status(400).json({ error });

export default {
    success,
    notFound,
    created,
    unauthorized,
    badRequest,
};