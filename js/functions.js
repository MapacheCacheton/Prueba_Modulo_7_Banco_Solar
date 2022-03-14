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
function querySelectAll2(){
    pool.connect(async (err_con, client, release)=>{
        if(err_con) console.error('Error '+err_con.code + ': ' +err_con.message)
        try {
            const response = await client.query(`SELECT * FROM usuarios`)
            release()
            console.log(response.rows);
            return response.rows
        } catch (err) {
            console.error(err.message);
        }
    })
    pool.end()
}

function queryInsertUser(data){
    pool.connect(async (err_con, client, release)=>{
        if(err_con) console.error('Error '+err_con.code + ': ' +err_con.message)
        try {
            const querySql = {
                text: `INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING*`,
                values: data
            }
            const response = await client.query(querySql)
            console.log(response.rows);
            release()

        } catch (err) {
            console.error(err.message);
        }
        pool.end()
    })
}

function queryDeleteUser(id){
    pool.connect(async (err_con, client, release)=>{
        if(err_con) console.error('Error '+err_con.code + ': ' +err_con.message)
        try {
            const querySql = {
                text: `DELETE FROM usuarios WHERE id = $1 RETURNING*`,
                values: [id]
            }
            const response = await client.query(querySql)
            console.log(response.rows);
            release()

        } catch (err) {
            console.error(err.message);
        }
        pool.end()
    })

}


module.exports = {getHtml, querySelectAll2, queryInsertUser, queryDeleteUser}