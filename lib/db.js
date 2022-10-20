import  mysql  from 'mysql2';
import  { Client } from 'ssh2';
const sshClient = new Client();

const dbServer = {
    host: '127.0.0.1',
    port: 3306,
    user: 'fifavrqx_fif_app',
    password: 'FIF@2022',
    database: 'fifavrqx_fif_prod'
}

const tunnelConfig ={
        host: 'premium99.web-hosting.com',
        port: 21098,
        username: 'fifavrqx',
        password: 'x4YzM_7_WA8E5414'
}

const forwardConfig = {
    srcHost: '127.0.0.1', // any valid address
    srcPort: 12345, // any valid port
    dstHost: dbServer.host, // destination database
    dstPort: dbServer.port // destination port
};

const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) {
                console.log("Error connecting to server: ", err);
                reject(err)
            };
             const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            const connection =  mysql.createConnection(updatedDbServer);
            connection.connect((error) => {
                if (error) {
                    console.log("Error connecting to DB: ", err);
                    reject(error);
                }
                resolve(connection);
                });
        });
    }).connect(tunnelConfig);
});

export  { SSHConnection } ;