        // 사용자 정보 가져오기
        async function fetchUserInfo() {
            try {
                const response = await fetch('/view/process/one_user');
                const userData = await response.json();
                document.getElementById('userName').textContent = userData.name;
            } catch (error) {
                alert('사용자 정보를 가져오지 못했습니다:(', error);
            }
        }

        // 게시글 목록 가져오기
        async function fetchPostList() {
            try {
                //url 경로 추후에 수정해야함
                //const response = await fetch('/view/process/all_user'); 
                const postList = await response.json();
                const postListElement = document.getElementById('postList');
                postListElement.innerHTML = postList.map((b, index) => `
                    <tr>
                        <td>${b.id}</td>
                        <td>${b.title}</td>
                        <td>${b.uid}</td>
                        <td>${b.comment}</td>
                        <td>${b.upload_date}</td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error fetching post list:', error);
            }
        }

        // 새 게시글 작성
        async function submitNewPost() {
            const title = document.getElementById('newPostTitle').value;
            const content = document.getElementById('newPostContent').value;
            try {
                //임시 url 경로
                const response = await fetch('/view/process/new_post', { //추후에 수정필요
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content }),
                });
                if (response.ok) {
                    alert('게시글이 성공적으로 작성되었습니다!:)');
                    closeModal();
                    fetchPostList(); // 목록 새로고침
                } else {
                    alert('게시글 작성에 실패했습니다.:(');
                }
            } catch (error) {
                console.error('Error submitting new post:', error);
                alert('게시글 작성 중 오류가 발생했습니다.:(');
            }
        }

        // 모달 열기
        function openModal() {
            document.getElementById('modalOverlay').style.display = 'flex';
        }

        // 모달 닫기
        function closeModal() {
            document.getElementById('modalOverlay').style.display = 'none';
            document.getElementById('newPostTitle').value = '';
            document.getElementById('newPostContent').value = '';
        }

        // 이벤트 리스너 설정
        document.addEventListener('DOMContentLoaded', () => {
            fetchUserInfo();
            fetchPostList();
            
            document.getElementById('newPostBtn').addEventListener('click', openModal);
            document.getElementById('modalClose').addEventListener('click', closeModal);
            document.getElementById('submitNewPost').addEventListener('click', submitNewPost);
            
            // 검색 기능
            // 보류함
        });