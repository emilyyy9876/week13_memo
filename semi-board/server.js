// server 
const express = require('express');
const app = express();

// db 
const mysql = require('mysql2');
const dbconfig = require('./config/dbconfig.json');
const pool = mysql.createPool({
    connectionLimit : 10,
    host : dbconfig['host'],
    user : dbconfig['user'],
    password : dbconfig['password'],
    database : dbconfig['database'],
    debug : false
});

// path
const path = require('path');
const static = require('serve-static');

// module
const user_module = require('./module/user_module.js');
const { callbackify } = require('util');

/* 미들웨어 함수
미들웨어를 설정하는 코드
주로, HTTP 요청의 본문:body를 ** 파싱하는 역할 **
사용자가 보낸 폼 데이터를 쉽게 다룰 수 있음.
extended:true 쿼리스트링 모듈인 qs라이브러리를 사용하여 파싱한다.
중첩된 객체 구조를 허용하기 때문에 복잡한 데이터를 처리할 수 있음.
배열이나 객체를 포함하는 데이터가 잘 파싱된다. 
*/
app.use(express.urlencoded({extended:true}));


/* 미들웨어 함수
express.js 에서 JSON 형식의 요청 본문을 파싱하는 미들웨어.
클라이언트가 서버로 전송한 요청 본문이 JSON형식일 때, 이를 자바스크립트 객체로 변환
JSON 데이터가 요청 객체의 req.body 에 파싱된 데이터가 담긴다.
*/
app.use(express.json());


/* 미들웨어 함수
express.static() 은 express 에서 정적 파일을 클라이언트에 제공하기 위해 사용
지정된 디렉토리를 정적 파일의 루트로 설정하고, 해당 경로에 있는 파일을 클라이언트가
URL을 통해 직접 접근할 수 있게 함.
/view 경로로 시작하는 요청을 처리할 때, view 디렉토리 내의 정적 파일을 제공한다.
*/
app.use('/src',static(path.join(__dirname,'./public/src')));
app.use('/css',static(path.join(__dirname,'./public/css')));
app.use('/js',static(path.join(__dirname,'./public/js')));


// route 
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/src','login.html'));
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/src/register.html'));
})

app.get('/board',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/src/board.html'));
})







// ============================ function ====================================

// register user API
app.post('/register',(req,res)=>{
    console.log('===== register request =====');
    
    const data = {
        'param_uid' : req.body.u_id,
        'param_upassword' : req.body.u_password,
        'param_unickname' : req.body.u_nickname
    }
    
    pool.getConnection((err,conn)=>{
        user_module.insert_user_in_db(err,res,conn,data);
    })
})


// login user API
app.post('/login',(req,res)=>{
    console.log('===== login request =====');

    const data = {
        'param_uid' : req.body.u_id,
        'param_upassword' : req.body.u_password
    }
    console.log(data);
    pool.getConnection(async(err,conn)=>{
        const get_bool = await user_module.login_check(err,res,conn,data);
        console.log(get_bool);
        if(get_bool){
            res.sendFile(path.join(__dirname,'./public/src/board.html'));
            //board select all 하는 함수 추가
            // res.render('/board');
        }else{
            res.send('로그인 실패');
        }
    })
})


// request one user data API
app.get('/view/process/one_user',(req,res)=>{
    console.log('===== get one user data request =====');

    const data = {
        'param_uid' : req.body.uid,
        'param_upassword' : req.body.upassword
    }
    pool.getConnection((err,conn)=>{
        user_module.get_one_user(err,res,conn,data);
    })
})


// request all user data API
app.get('/view/process/all_user',(req,res)=>{
    console.log('===== get all user data request =====');

    pool.getConnection((err,conn)=>{
        user_module.get_all_user(err,res,conn);
    })
})


// update user API
app.post('/view/process/update',(req,res)=>{
    console.log('===== update request =====');
    
    const data = {
        'param_uid' : req.body.uid,
        'param_upassword' : req.body.upassword
    }

    pool.getConnection((err,conn)=>{
        user_module.use(err,res,conn,data);
    })

})



app.listen(3000,()=>{
    console.log('listening on port 3000');
})
