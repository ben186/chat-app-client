async function getUsername(userId: string) {
  const response = await fetch(`https://localhost:7281/username?id=${userId}`, {
    credentials: 'include'
  });

  return await response.text();
}

export default getUsername;
