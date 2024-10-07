// 사용자 로그인 함수
function loginUser(u_id, u_password) {
    // API 엔드포인트 URL
    const url = '/view/process/login';

    // 요청 데이터
    const data = {
        u_id: u_id,
        u_password: u_password
    };

    // fetch를 사용하여 POST 요청 보내기
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert("로그인에 성공했습니다! :)");
        // 로그인 성공 시 추가 작업??(예: 사용자 세션 설정, 홈페이지로 리다이렉트 등)
    })
    .catch(error => {
        alert("로그인에 실패했습니다! :(");
        // 오류 처리 (예: 사용자에게 로그인 실패 메시지 표시)
    });
}

// 버튼 클릭 시 아이디, 비밀번호 변수 설정됨
document.getElementById('loginButton').addEventListener('click', function() {
    const u_id = document.getElementById('u_id').value;
    const u_password = document.getElementById('u_password').value;
    loginUser(u_id, u_password);
});


// document.getElementById('sign').addEventListener('click',function() {
    
// });