let user = document.getElementById("userID");
let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

document.getElementById("btn").addEventListener("click", () => {
    const userId = user.value;
    document.getElementById("userProfile").innerHTML = `<span class="loader"></span>`;
    fetchUser(userId);
    updateHistory(userId);
});

document.getElementById('themeSwitch').addEventListener('change', (event) => {
    if (event.target.checked) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeStatus').textContent = 'Dark Mode';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeStatus').textContent = 'Light Mode';
    }
});

document.getElementById('deleteHistory').addEventListener('click', () => {
    history = [];
    localStorage.removeItem('searchHistory');
    renderHistory();
});

function updateHistory(userId) {
    if (!history.includes(userId)) {
        history.push(userId);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', () => fetchUser(item));
        historyList.appendChild(li);
    });
}

renderHistory();

function fetchUser(userId) {
    fetch(`https://api.github.com/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === "Not Found") {
                document.getElementById("userProfile").innerHTML = `<h2>User Not Found</h2>`;
            } else {
                document.getElementById("userProfile").innerHTML = `
                    <div class="userInfo">
                        <img src="${data.avatar_url}" class="userImg" alt="Profile Image">
                        <div class="userName">${data.name}</div>
                        <div class="userDetail">Bio: ${data.bio}</div>
                        <div class="userFollow">
                            <div class="Follower">Followers: ${data.followers}</div>
                            <div class="Follower">Following: ${data.following}</div>
                        </div>
                        <a href="${data.html_url}" class="VisitProfile" target="_blank">Visit Profile</a>
                    </div>`;
                fetchRepositories(userId);
            }
        })
        .catch(error => console.log(error));
}

function fetchRepositories(userId) {
    fetch(`https://api.github.com/users/${userId}/repos`)
        .then(response => response.json())
        .then(data => {
            const repoList = document.getElementById('repoList');
            repoList.innerHTML = '';
            const sortBy = document.getElementById('sortRepo').value;
            data.sort((a, b) => b[sortBy] - a[sortBy]);
            data.forEach(repo => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${repo.name}</span>
                    <span class="repoDetail">(${repo[sortBy]} ${sortBy === 'stargazers_count' ? 'stars' : sortBy === 'forks_count' ? 'forks' : ''})</span>
                    <span class="bookmark" onclick="bookmarkRepo('${repo.name}')">Bookmark</span>`;
                repoList.appendChild(li);
            });
        })
        .catch(error => console.log(error));
}

function bookmarkRepo(repoName) {
    alert(`${repoName} bookmarked!`);
}
