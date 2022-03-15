const pool = require('./connection')
const fs = require('fs')


function getHtml(){
    try {
        const html = fs.readFileSync(__dirname + '/../index.html', 'utf-8')
        return html
    } catch (error) {
        console.error(error.message);
    }
}

async function querySelectAll(){
    try {
        const response = await pool.query(`SELECT * FROM usuarios;`)
        return response.rows
    } catch (err) {
        console.error(err.message);
    }
}

async function queryInsertUser(data){
    try {
        const querySql = {
            text: `INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING*`,
            values: data
        }
        const response = await pool.query(querySql)
    } catch (err) {
        console.error(err.message);
        }
}

async function queryDeleteUser(id){
    try {
        const querySql = {
            text: `DELETE FROM usuarios WHERE id = $1 RETURNING*`,
            values: [id]
        }
        const response = await pool.query(querySql)
        console.log(response.rows);
    } catch (err) {
        console.error(err.message);
    }
}
async function queryUpdateUser(data){
    try {
        const querySql = {
            text: `UPDATE usuarios SET nombre=$1, balance=$2 WHERE id=$3 RETURNING*`,
            values: data
        }
        const response = await pool.query(querySql)
        console.log(response.rows);
    } catch (err) {
        console.error(err.message);
    }
}

async function queryTransaction(emisor, receptor, monto){
    try {
        const data = []
        data.push(Number(await getID(emisor)))
        data.push(Number(await getID(receptor)))
        data.push(Number(monto))
        data.push(new Date())

        if(data[0] && data[1]){
            const TransactionSQL = {
                text: `INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING*`,
                values: data
            }
            try {
                await pool.query(`BEGIN;`)
                const result_t = await pool.query(TransactionSQL)
                const result_e = await pool.query(`UPDATE usuarios SET balance = balance - ${monto} WHERE id=${data[0]} RETURNING*;`)
                const result_r = await pool.query(`UPDATE usuarios SET balance = balance + ${monto} WHERE id=${data[1]} RETURNING*;`)
                await pool.query(`COMMIT;`)
                
                console.log(result_t.rows, result_e.rows, result_r.rows);
            } catch (error) {
                await pool.query(`ROLLBACK;`) 
                console.error(error);
            }
        }
        else{
            console.log('no se encontraron los datos', data);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getID(nombre){
    try {
        const querySql = {
            text: `SELECT id FROM usuarios WHERE nombre=$1;`,
            values: [nombre]
        }
        const response = await pool.query(querySql)
        return response.rows[0].id
    } catch (err) {
        console.error(err.message);
        }
}

async function queryGetTransactions(){
    try {   
        const querySql = {
            name: 'fetch-transferencias',
            rowMode: 'array',
            text: `SELECT t.id, u.nombre AS emisor, us.nombre AS receptor, monto, fecha FROM transferencias AS t INNER JOIN usuarios AS u ON u.id = t.emisor INNER JOIN usuarios AS us ON us.id = t.receptor;`
        }
        const response = await pool.query(querySql)
        return response.rows
    } catch (error) {
        console.error(err.message);
    }
}


module.exports = {getHtml, querySelectAll, queryInsertUser, queryDeleteUser, queryUpdateUser, queryTransaction, queryGetTransactions}