const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  //permitir que um novo repositório seja cadastrado
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {

  //recebo o id
  const { id: repositoryId } = request.params;

  //informacoes que serao atualizadas recebidas pelo corpo da requisicao
  const { title, techs, url } = request.body;

  //encontrar a posicao do repositorio no array de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === repositoryId);

  //caso nao encontre o repositorio
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  //spread do repositories[repositorio a ser atualizado] + atualizacoes
  const repository = { 
    ...repositories[repositoryIndex], 
    title,
    techs,
    url
  };

  //repositories[repositorio a ser atualizado] = recebe a atualizacao
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  //recebo o id dos params
  const { id: repositoryId } = request.params;
  //procuro a referencia( findIndex ) do repositorio pelo id passado
  const repositoryIndex = repositories.findIndex(repository => repository.id === repositoryId);
  //se a referencia for menos que zero, nao existe e retorna o erro
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  //se existe, eu removo a posicao da referencia com spliece
  repositories.splice(repositoryIndex, 1);
  //retorno uma resposta
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  //recebo o id
  const { id: repositoryId } = request.params;
  //procuro a referencia( findIndex ) do repositorio pelo id passado
  const repositoryIndex = repositories.findIndex(repository => repository.id === repositoryId);
  //se a referencia for menos que zero, nao existe e retorna o erro
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  //se existe, faço um incremento
  const likes = ++repositories[repositoryIndex].likes;
  //retorno o objeto: demorei pra achar isso.... :(
  return response.json({ likes });
});

module.exports = app;
