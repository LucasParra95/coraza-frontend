import { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [postsArray, setPostsArray] = useState<any[]>([]);
  const [instagramProfile, setInstagramProfile] = useState<any>({});
  
  useEffect( () => {
    const access_token = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;
    async function fetchMedia() {
      await fetch(`https://graph.instagram.com/me/media?fields=media_url,media_type,thumbnail_url&access_token=${access_token}`)
        .then(response => response.json())
        .then(res => setPostsArray(res.data.slice(0,9)));
      };
    async function fetchProfileData() {
      await fetch(`https://graph.instagram.com/me?fields=id,media_count,username&access_token=${access_token}`, {
        mode: "cors"
      })
        .then(response =>response.json())
        .then(res => setInstagramProfile(res));
      }; 
      fetchMedia();      
      fetchProfileData();
  },[]);

  if(!instagramProfile.id) {
    return (
      <div className="section section-instagram-feed">
        <div className='title-instagram'>
          <p>Seguinos en</p>
          <img src="/images/logos/instagram-logo.svg" alt="Not found" />
        </div>
      </div>
    )
  }

  return (
        <div className="section section-instagram-feed">
          <div className="container">
            <div className='title-instagram'>
              <p>Seguinos en</p>
              <img src="/images/logos/instagram-logo.svg" alt="Not found" />
            </div>
            <header className="section-instagram-feed__header">
              {instagramProfile ? (
                <div className='profile'>
                  <img 
                    className="logo"
                    src='/images/logos/Logo_Coraza-8.png'
                  />
                  <div className='profile-data-column'>
                    <div className='profile-data'>
                      <p>{instagramProfile.username}</p>
                      <button className='follow-button'>Seguir</button>
                    </div>
                    <div className='profile-data'>
                      <div className='element'>
                        <a><p>{instagramProfile.media_count}</p> publicaciones</a>
                      </div>
                      <div>
                        <a><p>250</p> seguidores</a>
                      </div>
                      <div>
                        <a><p>22</p> seguidos</a>
                      </div>
                    </div>
                    <div className='profile-data'>
                      <a>Coraza <br />
                        🇦🇷Productos de cuero confeccionados artesanalmente <br />
                        🏷️Ropa sin género <br />
                        La Plata, ARG 📦Envíos a todo el país
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div>

                </div>
              ) }
            </header>
            {postsArray.length && postsArray.map(post => {
              if(post.media_type === "VIDEO") {
                return (
                  <img key={post.id} className="section-instagram-feed__img" src={post.thumbnail_url}></img>
                )
              }
              return (
                <img key={post.id} className="section-instagram-feed__img" src={post.media_url}></img>
              )
            })}
          </div>
          <div className='fadeout'></div>
        </div>
      )
  };
  
  export default InstagramFeed