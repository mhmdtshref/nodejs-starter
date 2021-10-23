import http from 'http';
import './environment';
import database from './database/sequelize';
import app from './app';

const server = new http.Server(app);
database.authenticate();

server.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});
