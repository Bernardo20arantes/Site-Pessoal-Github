document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'Bernardo20arantes';
    const jsonServerUrl = 'https://replit.com/@barantes1/JSONServer';

    // Fetch GitHub user profile
    const fetchGithubProfile = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            const data = await response.json();
            document.getElementById('github-name').textContent = data.name;
            document.getElementById('github-bio').textContent = data.bio;
            document.getElementById('github-location').textContent = data.location;
            document.getElementById('github-url').href = data.blog;
            document.getElementById('github-url').textContent = data.blog;
        } catch (error) {
            console.error('Erro ao buscar o perfil do GitHub:', error);
        }
    };

    // Fetch GitHub repositories
    const fetchGithubRepositories = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
            const repos = await response.json();
            const reposContainer = document.getElementById('repos-container');
            repos.forEach(repo => {
                const repoCard = document.createElement('div');
                repoCard.classList.add('col');
                repoCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${repo.name}</h5>
                            <p class="card-text">${repo.description || 'Sem descrição'}</p>
                            <a href="repo.html?id=${repo.id}" class="btn btn-primary">Ver Repositório</a>
                        </div>
                    </div>
                `;
                reposContainer.appendChild(repoCard);
            });
        } catch (error) {
            console.error('Erro ao buscar os repositórios do GitHub:', error);
        }
    };

    // Fetch JSON Server data
    const fetchJsonServerData = async () => {
        try {
            const response = await fetch(`${jsonServerUrl}/conteudos`);
            const conteudos = await response.json();
            const carouselIndicators = document.querySelector('.carousel-indicators');
            const carouselInner = document.querySelector('.carousel-inner');
            conteudos.forEach((conteudo, index) => {
                const activeClass = index === 0 ? 'active' : '';
                const indicator = document.createElement('li');
                indicator.dataset.target = '#carouselExampleIndicators';
                indicator.dataset.slideTo = index;
                indicator.classList.add(activeClass);
                carouselIndicators.appendChild(indicator);

                const item = document.createElement('div');
                item.classList.add('carousel-item', activeClass);
                item.innerHTML = `
                    <a target="_blank" href="${conteudo.conteudoUrl}">
                        <img class="d-block w-100" src="${conteudo.imagemUrl}" alt="${conteudo.titulo}">
                    </a>
                `;
                carouselInner.appendChild(item);
            });

            const responseColegas = await fetch(`${jsonServerUrl}/colegas`);
            const colegas = await responseColegas.json();
            const colegasContainer = document.getElementById('comPessoas');
            colegas.forEach(colega => {
                const colegaCard = document.createElement('div');
                colegaCard.classList.add('pessoasEquipe');
                colegaCard.innerHTML = `
                    <figure>
                        <img src="${colega.fotoUrl}" alt="Uma imagem de ${colega.nome}">
                    </figure>
                    <h4>${colega.nome}</h4>
                    <a href="${colega.githubUrl}" target="_blank">Perfil no GitHub</a>
                `;
                colegasContainer.appendChild(colegaCard);
            });
        } catch (error) {
            console.error('Erro ao buscar os dados do JSON Server:', error);
        }
    };

    // Fetch repository details for repo.html
    const fetchRepositoryDetails = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const repoId = urlParams.get('id');
        if (repoId) {
            try {
                const response = await fetch(`https://api.github.com/repositories/${repoId}`);
                const repo = await response.json();
                document.getElementById('repo-name').textContent = repo.name;
                document.getElementById('repo-description').textContent = repo.description || 'Sem descrição';
                document.getElementById('repo-created').textContent = new Date(repo.created_at).toLocaleDateString('pt-BR');
                document.getElementById('repo-language').textContent = repo.language || 'Não especificada';
                document.getElementById('repo-link').href = repo.html_url;
                document.getElementById('repo-link').textContent = repo.full_name;

                const topicsContainer = document.getElementById('butoes');
                (repo.topics || []).forEach(topic => {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-primary');
                    button.textContent = topic;
                    topicsContainer.appendChild(button);
                });
            } catch (error) {
                console.error('Erro ao buscar os detalhes do repositório:', error);
            }
        }
    };

    // Detect current page and run appropriate functions
    if (document.getElementById('repos-container')) {
        fetchGithubProfile();
        fetchGithubRepositories();
        fetchJsonServerData();
    }

    if (document.getElementById('repo-name')) {
        fetchRepositoryDetails();
    }
});
