function addComment(fields) {
    fetch(`/api/comments/${fields.referenceId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function viewAllComments(fields) {
  fetch('/api/comments')
    .then(showResponse)
    .catch(showResponse);
}

function viewAllCommentsOnFreet(fields){
    fetch(`/api/comments?referenceId=${fields.id}`)
      .then(showResponse)
      .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
