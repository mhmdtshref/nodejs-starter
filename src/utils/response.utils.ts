import { Response } from "express";

/**
 * @memberof ResponseUtils
 * @name success
 * @description Sends success response (status code: 200)
 * @param {Response} response Client response to send the JSON to
 * @param {string} message Success message
 * @returns {Response} Returns an empty promise
 */
const success = (response: Response, data: { [key: string]: any }, message: string) => response.status(200).json({ data, message });

/**
 * @memberof ResponseUtils
 * @name notFound
 * @description Send not found error response (status code: 404)
 * @param {Response} response Client response to send the JSON to
 * @param {string} error Error message
 * @returns {Response} Returns the response
 */
const notFound = (response: Response, error: string) => response.status(404).json({ error });

/**
 * @memberof ResponseUtils
 * @name created
 * @description Send created success response (status code: 201)
 * @param {Response} response Client response to send the JSON to
 * @param {object} data Data message
 * @param {string} message Create message
 * @returns {Response} Returns the response
 */
const created = (response: Response, data: { [key: string]: any }, message: string) => response.status(201).json({ data, message });

/**
 * @memberof ResponseUtils
 * @name unauthorized
 * @description Send unauthorized error response (status code: 401)
 * @param {Response} response Client response to send the JSON to
 * @returns {Response} Returns an empty promise
 */
const unauthorized = (response: Response) => response.status(401).json({ error: 'Unauthorized' });

/**
 * @memberof ResponseUtils
 * @name badRequest
 * @description Send bad request error response (status code: 400)
 * @param {Response} response Client response to send the JSON to
 * @param {string} error Error message
 * @returns {Response} Returns an empty promise
 */
const badRequest = (response: Response, error: string) => response.status(400).json({ error });

/**
 * @memberof ResponseUtils
 * @name forbidden
 * @description Send forbidden error response
 * @param {Response} response Client response to send the JSON to
 * @param {string} error Error message
 * @returns {Response} Returns an empty promise
 */
const forbidden = (response: Response, error: string) => response.status(400).json({ error })

export default {
    success,
    notFound,
    created,
    unauthorized,
    badRequest,
    forbidden,
};
