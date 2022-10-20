import mysql from 'nodejs-mysql'
const config = {
    host: 'premium99.web-hosting.com',
    port: 21098,
    user: 'fifavrqx_fif_app',
    password: 'FIF@2022',
    database: 'fifavrqx_fif'
}
 
const db = mysql.getInstance(config)
export { db }