import { nanoid } from 'nanoid';

async function verifyAuth(username: string) {
  const id = nanoid(18);

  const response = await fetch(`https://localhost:7281/register?username=${username}&id=${id}`, {
    method: 'POST',
    credentials: 'include'
  });

  return await response.text();
}

export default verifyAuth;
