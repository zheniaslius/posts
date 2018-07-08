const ascending = document.querySelector('.ascending');
const descending = document.querySelector('.descending');
const postsContainer = document.querySelector('.posts-wrp');
const tagsContainer = document.querySelector('.tags');
const searchBtn = document.querySelector('.search');
const clearBtn = document.querySelector('.clear');

tagsContainer.addEventListener('click', (e) => {
  let tagValue = e.target.innerHTML;
  if (e.target.classList.contains('tag'))
    e.target.classList.toggle('selected');
});

clearBtn.addEventListener('click', (e) => {
  const tags = [...document.querySelectorAll('.tag')];

});

const getPosts = async () => {
  let response = await fetch('https://api.myjson.com/bins/152f9j');
  let posts = await response.json();
  return posts.data;
}

const displayPosts = posts => {
  let output = '';
  posts.forEach(post => {
    output += `
      <h1>${post.title}</h1>
      <span>${post.description}</span>
      <img src="${post.image}"></img>
      <img>${post.image}</img>
      <span>${post.createdAt}</span>
      <ul>${post.tags.map(tag => `<li>${tag}</li>`)}</ul>
      `;
  });
  postsContainer.innerHTML = output;
}

const displayTags = tags => {
  let output = '';
  tags.forEach(tag => {
    output += `<div class='tag'>${tag}</div>`
  });
  tagsContainer.innerHTML = output;
}

const sortDateByDesc = posts => {
  let newPosts = [...posts];
  newPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  displayPosts(newPosts);
}

const dateAsc = (a, b) => new Date(a.createdAt) - new Date(b.createdAt)

const sortDateByAsc = posts => {
  let newPosts = [...posts];
  newPosts.sort(dateAsc);
  displayPosts(newPosts);
}

const getUniqueTags = posts => {
  let allTags = [].concat(...(posts.map(item => [...item.tags])));
  let uniqueTags = [...new Set(allTags)];
  return uniqueTags;
}

const sameTagsCount = (post) => {
  let selectedTags = [...document.querySelectorAll('.tag.selected')];
  selectedTags = selectedTags.map(element => element.innerHTML);

  let tagsCount = 0;
  post.tags.forEach(tag => {
    if (selectedTags.includes(tag))
    tagsCount++;
  });
  return tagsCount;
}

const sortByTags = posts => {
  let sortedPosts = Array.from(posts);
  sortedPosts.sort((a, b) => {
    dateDiff = sameTagsCount(b) - sameTagsCount(a);
    return (dateDiff == 0) ? dateAsc : dateDiff;
  })
  displayPosts(sortedPosts);
}

const handleMenu = posts => {
  ascending.addEventListener('click', () => sortDateByAsc(posts));
  descending.addEventListener('click', () => sortDateByDesc(posts));

  displayTags(getUniqueTags(posts));
  searchBtn.addEventListener('click', () => sortByTags(posts))
}

getPosts().then(handleMenu);