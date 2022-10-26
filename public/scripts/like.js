function addLike(fields) {
    fetch(`/api/likes`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function removeLike(fields) {
  fetch('/api/likes')
    .then(showResponse)
    .catch(showResponse);
}

function getUsersLikes(fields){
    fetch(`/api/likes?userId=${fields.user}`, {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
}
