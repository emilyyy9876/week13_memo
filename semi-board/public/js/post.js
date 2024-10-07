// 게시글 ID를 URL 파라미터에서 가져옵니다
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// 게시글 데이터를 가져오는 함수
async function fetchPostData() {
    try {
        //임시 url
        //const response = await fetch(`/view/process/one_post?id=${postId}`); 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('게시물 정보를 가져오지 못했습니다 :(', error);
    }
}

// 댓글 목록을 가져오는 함수
async function fetchComments() {
    try {
        //임시 url
        //const response = await fetch(`/view/process/comments?postId=${postId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('댓글 정보를 가져오지 못했습니다 :(', error);
    }
}

// 게시글 정보를 화면에 표시하는 함수
function displayPostInfo(post) {
    const postInfo = document.getElementById('postInfo');
    postInfo.innerHTML = `
        <p><strong>글 번호:</strong> ${post.id}</p>
        <p><strong>제목:</strong> ${post.title}</p>
        <p><strong>작성일자:</strong> ${post.createdAt}</p>
        <p><strong>글쓴이:</strong> ${post.author}</p>
    `;
    document.getElementById('postContent').innerHTML = post.content;
}

// 댓글 목록을 화면에 표시하는 함수
function displayComments(comments) {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-info">
                <p><strong>댓글 번호:</strong> ${comment.id}</p>
                <p><strong>게시글 번호:</strong> ${comment.postId}</p>
                <p><strong>작성자:</strong> ${comment.author}</p>
                <p><strong>작성일자:</strong> ${comment.createdAt}</p>
            </div>
            <p>${comment.content}</p>
        </div>
    `).join('');
}

// 페이지 로드 시 게시글 정보와 댓글을 가져와 표시
window.addEventListener('load', async () => {
    const postData = await fetchPostData();
    displayPostInfo(postData);

    const comments = await fetchComments();
    displayComments(comments);
});

// 댓글 작성 폼 제출 처리
document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('commentContent').value;
    try {
        const response = await fetch('/view/process/add_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, content }),
        });
        if (response.ok) {
            // 댓글 작성 성공 시, 댓글 목록을 새로고침
            const comments = await fetchComments();
            displayComments(comments);
            document.getElementById('commentContent').value = '';
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
});