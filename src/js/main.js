const ascending = document.querySelector('.ascending');
const descending = document.querySelector('.descending');
const postsContainer = document.querySelector('.posts-wrp');
const tagsContainer = document.querySelector('.tags');
const searchBtn = document.querySelector('.search');
const clearBtn = document.querySelector('.clear');
const search = document.querySelector('#search');

tagsContainer.addEventListener('click', (e) => {
  let tag = e.target;
  let tagValue = e.target.innerHTML;
  if (tag.classList.contains('tag')) {
    tag.classList.toggle('selected');
  }
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
      <div class="post">
        <h1>${post.title}</h1>
        <span>${post.description}</span>
        <img src="${post.image}"></img>
        <img>${post.image}</img>
        <span>${post.createdAt}</span>
        <ul>${post.tags.map(tag => `<li>${tag}</li>`)}</ul>
        <button id="delete-post">Delete</button>
      </div>
      `;
  });
  postsContainer.innerHTML = output;

  document.addEventListener('scroll', event => {
    let element = event.target;
  
    var scrollTop = element.scrollTop || document.documentElement.scrollTop;
    if (scrollTop + window.innerHeight >= document.body.offsetHeight) {
      postsContainer.innerHTML += output;
    }
  });
  
  return posts;
}

const displayTags = tags => {
  let output = '';
  tags.forEach(tag => {
    output += `<div class='tag'>${tag}</div>`
  });
  tagsContainer.innerHTML = output;
}

const sortDateByDesc = posts => {
  localStorage.setItem('sortBy', 'dateDesc');
  let newPosts = [...posts];
  newPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  displayPosts(newPosts);
}

const dateAsc = (a, b) => new Date(a.createdAt) - new Date(b.createdAt)

const sortDateByAsc = posts => {
  localStorage.setItem('sortBy', 'dateAsc');
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
  localStorage.setItem('sortBy', 'tags');
  let sortedPosts = Array.from(posts);
  sortedPosts.sort((a, b) => {
    dateDiff = sameTagsCount(b) - sameTagsCount(a);
    return (dateDiff == 0) ? dateAsc : dateDiff;
  })
  displayPosts(sortedPosts);
}

const handleSearch = (e, posts) => {
  let searchFor = e.target.value.toLowerCase();
  displayPosts(posts.filter(post => post.title.toLowerCase().includes(searchFor)));
}

const handlePostDelete = () => {
  const deleteBtn = [...document.querySelectorAll('#delete-post')];
  deleteBtn.forEach(btn => btn.addEventListener('click', e => 
    e.target.parentElement.style.display = "none")
  );
}

const handleMenu = posts => {
  ascending.addEventListener('click', () => sortDateByAsc(posts));
  descending.addEventListener('click', () => sortDateByDesc(posts));
  search.addEventListener('keyup', e => handleSearch(e, posts));
  searchBtn.addEventListener('click', () => sortByTags(posts));

  displayTags(getUniqueTags(posts));
}

const initialRender = posts => {
  let sortBy = localStorage.getItem('sortBy');
  switch (sortBy) {
    case 'tags': 
      sortByTags(posts);
      break;
    case 'dateAsc':
      sortDateByAsc(posts);
      break;
    default:
      sortDateByDesc(posts);  
  }
  return posts;
}

getPosts()
  .then(initialRender)
  .then(handleMenu)
  .then(handlePostDelete);