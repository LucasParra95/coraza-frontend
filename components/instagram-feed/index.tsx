import { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [postsArray, setPostsArray] = useState<any[]>([]);

  useEffect( () => {
    async function fetchData() {
      await fetch("https://graph.instagram.com/me/media?fields=media_url&access_token=IGQWRNTnFQMUNnbkhrNjhxemVjRU9OSXJEZA2d4dDItVGpBZAW14QXQ1WFVNYVdGeDVDU19rbVRTd2ZAmWW94Tnk3MFN6R29nQlJKX2lxdkJoNHJDWEZA3STBRdGtrS3U0bFhsQTVqX1Vtc0JaQ3BLLWk0UTNWVXpGQnMZD")
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