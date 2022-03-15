const http = require('http')
const url = require('url')
const {getHtml, querySelectAll, queryInsertUser, queryDeleteUser, queryUpdateUser, queryTransaction, queryGetTransactions} = require('./functions')

http.createServer(async (req, res)=>{
    if(req.url == '/'){
        const html = getHtml()
        res.setHeader('content-type', 'text/html')
        res.statusCode = 200
        res.end(html)
    }
    if(req.url.includes('/usuario') && req.method == 'POST'){
        let body

        req.on('data', (payload => {
            body = JSON.parse(payload)
        }))
        req.on('end', async ()=>{
            const data = Object.values(body)
            await queryInsertUser(data)
            res.statusCode = 200
            res.end()
        })
    }
    if(req.url.includes('/usuarios') && req.method == 'GET'){
        const response = await querySelectAll()
        res.statusCode = 200
        res.end(JSON.stringify(response))
    }
    if(req.url.includes('/usuario') && req.method == 'PUT'){
        const {id} = url.parse(req.url, true).query
        let body

        req.on('data', (payload)=>{
            body = JSON.parse(payload)
        })
        req.on('end', async ()=>{
            const data = Object.values(body)
            data.push(id)
            await queryUpdateUser(data)
            res.statusCode = 200
            res.end()
        })
    }
    if(req.url.includes('/usuario') && req.method == 'DELETE'){
        const {id} = url.parse(req.url, true).query
        await queryDeleteUser(id)
        res.statusCode = 200
        res.end()
    }

    if(req.url.includes('/transferencia') && req.method == 'POST'){
        let body

        req.on('data', (payload)=>{
            body = JSON.parse(payload)
        })
        req.on('end', async ()=>{
            const {emisor, receptor, monto} = body
            await queryTransaction(emisor, receptor, monto)
            res.statusCode = 200
            res.end()
        })
    }
    if(req.url.includes('/transferencias') && req.method == 'GET'){
        const data =  await queryGetTransactions()
        res.statusCode = 200
        res.end(JSON.stringify(data))
    }

}).listen(3000, ()=>console.log('SERVER ON - PORT: 3000 - PROCESS: '+ process.pid))
