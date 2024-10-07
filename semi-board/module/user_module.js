function insert_user_in_db(err,res,conn,data){
    console.log('function in')
    if(err) {throw err;}

    console.log('db connection success & get pool');

    let now = new Date();
    now = `${now.getUTCFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // const _query = 'INSERT INTO user (uid,upassword) VALUES (?,?)';
    const sql = 'INSERT INTO user (u_id,u_password,u_nickname,u_reg_date) VALUES (?,SHA2(?, 256),?,?)';
    const query_values = [data['param_uid'],data['param_upassword'],data['param_unickname'],now];

    const exec = conn.query(sql, query_values,
        (err,result)=>{
            /*
            pool 반납 , 연결이 끊기는 것은 아님. 추후 유저가 많아지면 pool 개수를 늘려야함.
            conn.release()를 호출하지 않으면 연결이 풀에 반환되지 않고 유지되며, 
            결국 풀의 연결 수가 부족해지는 문제가 발생할 수 있습니다. 이는 메모리 누수 및 성능 저하로 이어집니다.
            */
            conn.release();

            if(err){
                console.log('SQL error');
                // console.dir(err); // 객체의 모든 속성을 확인하고 싶을때, 오류처리 디버깅할 때 유용
                throw err;
            }

            if(result){
                console.log('INSERT USER DATA SUCCESS');
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>회원가입 성공</h2>');
                res.end();
            }else{
                console.log('INSERT USER DATA FAIL');
                res.write('<h2>회원가입 실패</h2>');
                res.end();
            }
        }
    )
}


function login_check(err,res,conn,data){
    return new Promise((resolve, reject) => {
        if (err) {
            reject(err);
            return;
        }
        
        const sql = 'SELECT u_id,u_password FROM user WHERE u_id = ? and u_password = ?';
        const query_values = [data['param_uid'],data['param_upassword']];

        conn.query(sql, query_values, (err, rows) => {
            conn.release();
            if (err) {
                console.log('SQL error');
                console.dir(err);
                reject(err);
                return;
            }
    
            if (rows.length === 1) {
                resolve(true); // 로그인 성공
            } else {
                resolve(false); // 로그인 실패
            }
        });
    });
}


function get_all_user(err,res,conn){
    if(err){throw err;}

    conn.query('SELECT * FROM user',
        (err,rows)=>{
            conn.release();

            if(err){
                console.log(' SQL error');
                console.dir(err);
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>SQL query fail</h2>');
                res.end();
                return;
            }
            if(rows.lenth == 0){
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>GET DATA FAIL</h2>');
                res.end();
                return;
            }else{
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>GET DATA SUCCESS</h2>');
                res.json(rows);
                res.end();
                return;
            }
        }
    )
}


function get_one_user(err,res,conn,data){
    if(err){throw err;}

    const _query = 'SELECT uid,upassword FROM user WHERE uid = ? and upassword = SHA2(?,256)';
    const query_values = [data['param_uid'],data['param_upassword']];

    const exec = conn.query(_query,query_values,
        (err,rows)=>{
            conn.release();

            if(err){
                console.log(' SQL error');
                console.dir(err);
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>SQL query fail</h2>');
                res.end();
                callback(false); 
                return;
            }

            if(rows.lenth > 0){
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.json(rows[0]);
                res.end();
                callback(true); // 성공을 콜백으로 전달
                return;
            }else{
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.end();
                callback(false); 
                return;
            }
        }
    )
}

function use(err,res,conn,data){
    if (err) {
        console.error('Error getting connection:', err);
        return;
    }

    get_one_user(err, res, conn, data)
        .then(isLoggedIn => {
            if (isLoggedIn) {
                // 로그인 체크가 true일 때 update_user_data 호출
                update_user_data(err,res,conn,data);
            } else {
                res.status(401).send('Unauthorized');
            }
        })
        .catch(loginError => {
            console.error('Login check error:', loginError);
            res.status(500).send('Login check failed');
        })
        .finally(() => {
            // 연결 반환
            conn.release();
        });
}


function update_user_data(err,res,conn,data){
    if(err){throw err;}

    const _query = 'UPDATE user SET upassword = SHA2(?,256) WHERE uid = ?';
    const query_values = [data['param_upassword'],data['param_uid']];

    const exec = conn.query(_query,query_values,
        (err,rows)=>{
            conn.release();

            if(err){
                console.log(' SQL error');
                console.dir(err);
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>SQL query fail</h2>');
                res.end();
                return;
            }

            if(rows.lenth > 0){
                console.log(rows.length == 1 ? '로그인 가능' : '로그인 불가능');
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>Login success</h2>');
                res.end();
                return;
            }else{
                res.writeHead('200',{'Content-Type':'text/html; charset=utf8'})
                res.write('<h2>Login fail</h2>');
                res.end();
                return;
            }
        }
    )
}



module.exports = {
    insert_user_in_db,
    login_check,
    get_all_user,
    get_one_user,
    update_user_data

}





// app.post('/view/process/register', async (req, res) => {
//     console.log('===== register request =====');
  
//     const data = {
//       'param_uid': req.body.uid,
//       'param_upassword': req.body.upassword
//     };
  
//     const MAX_RETRIES = 3; // 최대 재시도 횟수
//     let attempts = 0;
//     let connection = null;
  
//     // getConnection을 Promise로 감싸서 사용
//     const getConnection = () => {
//       return new Promise((resolve, reject) => {
//         pool.getConnection((err, conn) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(conn);
//           }
//         });
//       });
//     };
  
//     // 재시도 로직
//     while (attempts < MAX_RETRIES) {
//       try {
//         connection = await getConnection();
//         break; // 성공적으로 연결되면 while 루프를 탈출
//       } catch (error) {
//         attempts++;
//         console.error(`Connection attempt ${attempts} failed:`, error);
//       }
//     }
  
//     if (connection) {
//       user_module.insert_user_in_db(null, res, connection, data);
//     } else {
//       console.error('Failed to obtain a connection after multiple attempts.');
//       res.status(500).send('Failed to connect to the database. Please try again later.');
//     }
//   });
  