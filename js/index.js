const http = require('http')
const url = require('url')
const {getHtml, querySelectAll2, queryInsertUser, queryDeleteUser} = require('./functions')

http.createServer(async (req, res)=>{
    if(req.url == '/'){
        const html = getHtml()
        res.setHeader('content-type', 'text/html')
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
        })
    }
    if(req.url.includes('/usuarios') && req.method == 'GET'){
        const response = await querySelectAll2()
        console.log(response);
        res.end(JSON.stringify(response))
    }
    if(req.url.includes('/usuario') && req.method == 'PUT'){

    }
    if(req.url.includes('/usuario') && req.method == 'DELETE'){
        const {id} = url.parse(req.url, true).query
        await queryDeleteUser(id)
        res.end()
    }

}).listen(3000, ()=>console.log('SERVER ON - PORT: 3000 - PROCESS: '+ process.pid))
