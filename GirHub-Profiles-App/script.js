
const GITHUB_API = 'https://api.github.com/users/';

const inputEl = document.getElementById("input");
const submitBtn = document.getElementById("submit");

const userDetailsSection = document.getElementById("user-details");
const mainDetailsSection = document.getElementById("main-details");
const repoDetailsSection = document.getElementById("repos");

const notFoundSection = document.querySelector(".not-found");


async function getUser(user) {
    const respData = await fetch(GITHUB_API + user);
    const respJsonData = await respData.json();
    return respJsonData;
}

async function getRepos(user) {
    const respData = await fetch(GITHUB_API + user + "/repos");
    const respJsonData = await respData.json();
    return respJsonData;
}

submitBtn.addEventListener('click', (e) => {
    const username = inputEl.value;
    if (inputEl.value) {
        e.preventDefault();
        inputEl.value = '';
        getUser(username).then((userDetails) => {
            if (userDetails.name) {
                mainDetailsSection.innerHTML = `
                <div class="img-container">
                    <img src=${userDetails.avatar_url} alt="userimage">
                    <span class="center">${userDetails.name}</span>
                </div>
                <div class="details-container">
                    <p><span>Bio: </span>${userDetails.bio}</p>
                    <p><a href=${userDetails.blog} target="_blank">${userDetails.blog}</a>
                        <label for="hireable">Hireable</label>
                        <input type="checkbox" name="hireable" id="hireable" onclick="return false;" onkeydown="return false;" ${userDetails.hireable ? 'checked' : 'unchecked'}>
                    </p>
                    <div class="follow">
                        <p>Followers: <span>${userDetails.followers}</span></p>
                        <p>Following: <span>${userDetails.following}</span></p>
                    </div>
                </div>`;
                const allrepos = getRepos(username).then((repos) => {
                    if (repos.length > 0) {
                        repoDetailsSection.innerHTML='';
                        const reposEl = document.createElement('h4');
                        reposEl.innerText = "Repos:";
                        reposEl.style.fontWeight = 'bold';
                        repoDetailsSection.appendChild(reposEl);
                        for (let i = 0; i < repos.length-1 && i < 4; i++) {
                            const repoEl = document.createElement('p');
                            repoEl.innerHTML = `<a href=${repos[i].html_url} target="_blank" class="link">${repos[i].name}</a>`;
                            repoEl.classList.add('repo');
                            repoDetailsSection.appendChild(repoEl);
                        }
                    }

                });
                notFoundSection.style.display = 'none';
                userDetailsSection.style.display = 'block';
            } else {
                inputEl.value = '';
                userDetailsSection.style.display = 'none';
                const notFoundText = document.createElement('h1');
                notFoundText.innerText = `${username} not found`;
                notFoundSection.innerHTML = '';
                notFoundSection.appendChild(notFoundText);
                notFoundSection.style.display = 'block';
            }
        });
    }
});