# **[APP_NAME]**
[APP_DESCRIPTION]

## **Technologies:**
- Environment: [NodeJS](https://nodejs.org/])
- Server App: [ExpressJS](https://expressjs.com/)
- ORM: [Sequelize](https://sequelize.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Package manager: [NPM](https://www.npmjs.com/)
- API Documentation: [Swagger](https://swagger.io/)

## **Authentications Supported:**
- Password (with email)
- OAuth2.0: Supports all of [Google](https://www.google.com), [Facebook](https://www.facebook.com), [LinkedIn](https://www.linkedin.com) providers

## **Installation**
1. **Clone project:**
<br/>Open CMD and go to the directory you want to clone the app in and run:
  ```
  git clone git@github.com:mhmdtshref/nodejs-starter.git
  ```
   2. **Install modules:**
<br/>Using cmd, go to project directory and run packages install script:
   ```
   npm install
   ```
   3. **Create database:**
<br/>Create a PostgreSQL database to be able to connect the app to it (supposed to be empty database).
   4. **Create env file:**
<br/>Copy content of `.env.example` and paste it in an new file `.env.local` put the new file in the root directory.

   5. **Run development in mode:**
<br/>To run the code under development mode locally, run this script:
   ```
   npm run local
   ```
   6. Build project:
<br/>To build project (this will generate a new directory `dist/` in the root), run the script:
```
npm run build
```

Now, installation is finished. You can start developing more features.

## **Rules:**
- Do not use `promises`, use `await/async` instead.
- Use `export default` from files, except in `index.ts` files.
- Do not push unlinted code.
- Do not push code makes the build fail.
- Do not push to `master` branch.

## **Have a nice hack!**
