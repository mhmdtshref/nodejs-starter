import { Router } from 'express';
import { AuthController } from '@controllers';
import { AuthMiddleware } from '@middlewares';

const router = Router();

/**
 *  @swagger
 *  tags:
 *  - name: "Authentication"
 *    description: "Requests related to user authentication"
 */

/**
 *  @swagger
 *  securityDefinitions:
 *      Bearer:
 *          type: "API key"
 *          name: "Authorization"
 *          in: "header"
 */


/**
 *  @swagger
 *  definitions:
 *      User Registration Request Body:
 *          type: "object"
 *          properties:
 *              method:
 *                  type: "string"
 *                  description: "Registration method to be used"
 *                  enum:
 *                  - "password"
 *                  - "oauth2"
 *                  required: "Yes"
 *              provider:
 *                  type: "string"
 *                  description: "Shows the OAuth2.0 provider to be used"
 *                  enum:
 *                  - "google"
 *                  - "facebook"
 *                  - "linkedIn"
 *                  required: "Only when method value is 'oauth2'"
 *              data:
 *                  type: "object"
 *                  description: "Registration data to be used in request"
 *                  properties:
 *                      firstName:
 *                          type: "string"
 *                          example: "Mohamed"
 *                          description: "User first name"
 *                          required: "Only when method value is 'password'"
 *                      lastName:
 *                          type: "string"
 *                          example: "Sharif"
 *                          description: "User last name"
 *                          required: "Only when method value is 'password'"
 *                      email:
 *                          type: "string"
 *                          example: "mhmdtshref@gmail.com"
 *                          description: "User email that will be used for login"
 *                          format: "email"
 *                          required: "Only when method value is 'password'"
 *                      birthDate:
 *                          type: "string"
 *                          example: "07-26-1996"
 *                          description: "User date of birth"
 *                          format: "date: MM-DD-YYYY"
 *                          required: "Only when method value is 'password'"
 *                      password:
 *                          type: "string"
 *                          example: "Pas$w0rd@2022"
 *                          description: "Password that will be used to login"
 *                          required: "Only when method value is 'password'"
 *                      code:
 *                          type: "string"
 *                          example: "[get_it_from_OAuth2.0_provider]"
 *                          description: "Authorization code returned from provider to be used by server to get user details"
 *                          required: "Only when method value is 'oauth2'"
 * 
 * 
 *      User Login Request Body:
 *          type: "object"
 *          properties:
 *              method:
 *                  type: "string"
 *                  description: "Login method to be used"
 *                  enum:
 *                  - "password"
 *                  - "oauth2"
 *                  required: "Yes"
 *              provider:
 *                  type: "string"
 *                  description: "Shows the OAuth2.0 provider to be used"
 *                  enum:
 *                  - "google"
 *                  - "facebook"
 *                  - "linkedIn"
 *                  required: "Only when method value is 'oauth2'"
 *              credentials:
 *                  type: "object"
 *                  description: "Registration data to be used in request"
 *                  properties:
 *                      email:
 *                          type: "string"
 *                          example: "mhmdtshref@gmail.com"
 *                          description: "User email that will be used for login"
 *                          format: "email"
 *                          required: "Only when method value is 'password'"
 *                      password:
 *                          type: "string"
 *                          example: "Pas$w0rd@2022"
 *                          description: "Password that will be used to login"
 *                          required: "Only when method value is 'password'"
 *                      code:
 *                          type: "string"
 *                          example: "[get_it_from_OAuth2.0_provider]"
 *                          description: "Authorization code returned from provider to be used by server to get user details"
 *                          required: "Only when method value is 'oauth2'"
 * 
 *      User Verify Request Body:
 *          type: "object"
 *          properties:
 *              verificationCode:
 *                  type: "string"
 *                  description: "Veridication code that been sent to email"
 *                  example: "[get_it_from_email]"
 *                  required: "Yes"
 */

/**
 *  @swagger
 *  /auth/register:
 *      post:
 *          tags:
 *          - "Authentication"
 *          summary: "Register a new user"
 *          description: "User registration by password or OAuth2.0 (Google, Facebook or LinkedIn)"
 *          consumes:
 *          - "application/json"
 *          produces:
 *          - "application/json"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "Object that describes registration settings (like method) and data required for it"
 *            required: "Yes"
 *            schema:
 *              $ref: "#/definitions/User Registration Request Body"
 *          responses:
 *              '201':
 *                  description: "Registration success and token returned"
 *              '400':
 *                  description: "Bad request with reason message"
 */
router.post('/register', AuthController.register);

/**
 *  @swagger
 *  /auth/login:
 *      post:
 *          tags:
 *          - "Authentication"
 *          summary: "User login request"
 *          description: "User login by password or OAuth2.0 (Google, Facebook or LinkedIn)"
 *          consumes:
 *          - "application/json"
 *          produces:
 *          - "application/json"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "Object that describes login settings (like method) and data required for it"
 *            required: "Yes"
 *            schema:
 *              $ref: "#/definitions/User Login Request Body"
 *          responses:
 *              '201':
 *                  description: "Login success and token returned"
 *              '400':
 *                  description: "Bad request with reason message"
 */
router.post('/login', AuthController.login);

/**
 *  @swagger
 *  /auth/verify/{id}:
 *      patch:
 *          tags:
 *          - "Authentication"
 *          summary: "Verifies user account"
 *          description: "Use the code sent to user's email to verify his account"
 *          consumes:
 *          - "application/json"
 *          produces:
 *          - "application/json"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "Object that contains data required to verify user account"
 *            required: "Yes"
 *            schema:
 *              $ref: "#/definitions/User Verify Request Body"
 *          - in: "path"
 *            name: "id"
 *            type: "integer"
 *            description: "User account id to be verified"
 *            required: "Yes"
 *          responses:
 *              '201':
 *                  description: "Account verified successfully"
 *              '400':
 *                  description: "Bad request with reason message"
 */
router.patch('/verify', [AuthMiddleware.isPendingVerification], AuthController.verify);

/**
 *  @swagger
 *  /auth/resend-verification-code/{id}:
 *      get:
 *          tags:
 *          - "Authentication"
 *          summary: "Resend verification code"
 *          description: "Resend verification code to the email, so user can validate his account"
 *          consumes:
 *          - "application/json"
 *          produces:
 *          - "application/json"
 *          security:
 *          - Bearer: []
 *          parameters:
 *          - in: "path"
 *            name: "id"
 *            type: "integer"
 *            description: "User account id to send verification code to his email"
 *            required: "Yes"
 *          responses:
 *              '201':
 *                  description: "Verification code resent to the account email"
 *              '400':
 *                  description: "Bad request with reason message"
 */
router.get('/resend-verification-code/:id', [AuthMiddleware.isAuthorized, AuthMiddleware.isPendingVerification], AuthController.requestVerificationEmail);

export default router;
