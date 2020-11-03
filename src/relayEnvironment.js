export const performFetch = (operation, variables) =>
  window
    .fetch('/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: operation.text,
        variables,
      })
    });