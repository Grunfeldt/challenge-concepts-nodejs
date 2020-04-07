const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository id!'});
  }
  
  const repositoryIndex = repositories.findIndex(r => r.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ 'error': 'Repository not found!'});
  }

  next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  
  const results = title 
    ? repositories.filter(r => r.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  console.log(`Novo repository, title: ${title}, url: ${url}, techs: ${techs}`);
  
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(r => r.id === id);

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  repository = repositories[repositoryIndex];
  repository.likes++;

  return response.json(repository);
});

module.exports = app;