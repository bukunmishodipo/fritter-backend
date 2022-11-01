
function addPromptResponse(fields) {
    fetch('/api/prompts', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewAllPromptResponses(fields){
    fetch('/api/prompts')
    .then(showResponse)
    .catch(showResponse);
}

function viewUsersPromptResponse(fields){
    fetch(`/api/prompts?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function updatePromptResponse(fields){
    fetch(`/api/prompts/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removePromptResponse(fields){
    fetch(`/api/prompts/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}