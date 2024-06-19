import { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [postsArray, setPostsArray] = useState<any[]>([]);
  
  useEffect( () => {
    const access_token = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;

    async function fetchData() {
      await fetch(`https://graph.instagram.com/me/media?fields=media_url&access_token=${access_token}`)
        .then(response => response.json())
        .then(res => setPostsArray(res.data.slice(0,9)))
    };
    fetchData();
  },[]);

    return (
      <div className="section section-instagram-feed">
        <div className="container">
          <header className="section-instagram-feed__header">
            <h3>Aca va el feed de instagram</h3>
          </header>
          {postsArray.map(post => {
            return (
              <img className="section-instagram-feed__img" src={post.media_url}></img>
            )
          })}
        </div>
      </div>
    )
  };
  
  export default InstagramFeed