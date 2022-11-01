function addLike(fields) {
    fetch(`/api/likes/`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function removeLike(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function getAllLikes(fields){
  fetch('/api/likes')
    .then(showResponse)
    .catch(showResponse);
}


function getUsersLikes(fields){
    fetch(`/api/likes?user=${fields.user}`)
      .then(showResponse)
      .catch(showResponse);
}

function getReferenceLikes(fields){
  fetch(`/api/likes?referenceId=${fields.referenceId}`)
    .then(showResponse)
    .catch(showResponse);
}

/**
 * GET      /api/likes?author=mufaro   =>   req.query.author = mufaro
 * DELETE   /api/likes/:author?        =>   req.params.author = mufaro
 * POST     /api/likes        with body               
 */
