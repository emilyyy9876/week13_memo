//세 개의 section
const userInfo = document.getElementById('userInfo');
const passwordCheck = document.getElementById('passwordCheck');
const changeInfoForm = document.getElementById('changeInfoForm');

//"내 게시글 확인하기"버튼----> 보류
// const checkMyPostsBtn = document.getElementById('checkMyPosts');

//세개의 섹션(userInfo, passwordCheck, changeInfoForm) 중에 하나만 보이게 하는 함수
function showSection(sectionToShow) {
    [userInfo, passwordCheck, changeInfoForm].forEach(section => {
        section.style.display = section === sectionToShow ? 'block' : 'none';
    });
    checkMyPostsBtn.style.display = sectionToShow === userInfo ? 'block' : 'none';
}

//"정보변경하기" 버튼을 눌렀을 때,showSection시행되게 함 -->비밀번호 확인하는 창만 보임
document.getElementById('changeMyInfo').addEventListener('click', function() {
    showSection(passwordCheck);
});

//사용자 검증 위해 비밀번호 입력 후 "확인" 버튼을 눌렀을 때, 현재 비밀번호가 맞는지 확인하는 로직
document.getElementById('verifyPassword').addEventListener('click', function() {
    const currentPassword = document.getElementById('currentPassword').value;
    const userId = document.getElementById('cur_userName').textContent; // 현재 로그인한 사용자의 ID
    
    // 서버로 비밀번호 확인 요청
    fetch('###########', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ u_id: userId, u_password: currentPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 비밀번호 확인 성공
            showSection(changeInfoForm);
            
            // 폼에 현재 사용자 정보 표시
            document.getElementById('u_id').value = document.getElementById('userName').textContent;
            document.getElementById('u_password').value = ''; // 보안을 위해 비워둠
            document.getElementById('u_nickname').value = document.getElementById('cur_nickname').textContent;
        } else {
            // 비밀번호 확인 실패
            alert("실패했습니다! 비밀번호를 다시 입력해주세요! :(");
            document.getElementById('currentPassword').value = ''; // 비밀번호 입력 필드 초기화
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
    });
});

// 정보 변경 확인 버튼 클릭 이벤트
document.getElementById('confirmChangeInfo').addEventListener('click', function(e) {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    const newId = document.getElementById('u_id').value;
    const newPassword = document.getElementById('u_password').value;
    const newNickname = document.getElementById('u_nickname').value;

    // 서버로 정보 변경 요청
    fetch('########', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            //사용자 정보 찾기 위해 현재, id 같이 보냄
            userId: document.getElementById('userName').textContent, 
            newId: newId,
            newPassword: newPassword,
            newNickname: newNickname
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("정보가 성공적으로 변경되었습니다.");
            // 변경된 정보로 화면 업데이트
            document.getElementById('userName').textContent = newId;
            document.getElementById('cur_nickname').textContent = newNickname;
            showSection(userInfo); // 사용자 정보 섹션으로 돌아가기
        } else {
            alert("정보 변경에 실패했습니다.:( 다시 시도해주세요.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("오류가 발생했습니다.:( 다시 시도해주세요.");
    });
});

// 초기 상태 설정
showSection(userInfo);