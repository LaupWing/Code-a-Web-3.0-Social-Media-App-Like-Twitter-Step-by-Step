
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button, Card, ListGroup } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Home = ({ contract }) => {
   const [loading, setLoading] = useState(true)
   const [hasProfile, setHasProfile] = useState(false)
   const [posts, setPosts] = useState(false)

   const loadPosts = async () =>{
      const balance = await contract.balanceOf(account)
      setHasProfile(()=> balance > 0)

      const results = await contract.getAllPosts()
      let posts = await Promise.all(results.map(async i=>{
         let response = await fetch(`https://ipfs.infura.io/ipfs/${i.hash}`)
         const metadataPost = await response.json()

         const nftId = await contract.profiles(i.author)
         const uri = await contract.tokenURI(nftId)

         response = await fetch(uri)
         const metadataProfile = await response.json()

         const author = {
            address: i.author,
            username: metadataProfile.username,
            avatar: metadataProfile.avatar
         }
         return {
            id: i.id,
            content: metadataPost.post,
            tipAmount: i.tipAmount,
            author
         }
      }))

      posts = posts.sort((a,b)=> b.tipAmount - a.tipAmount)
      setLoading(false)
      setPosts(posts)
   }

   useEffect(()=>{
      if(!posts){
         loadPosts()
      }
   },[])

   if (loading) return (
      <div className='text-center'>
         <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
         </main>
      </div>
   )
   return (
      <div className="container-fluid mt-5">
         {hasProfile ?
            (<div className="row">
               <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                  <div className="content mx-auto">
                     <Row className="g-4">
                        <Form.Control onChange={(e) => setPost(e.target.value)} size="lg" required as="textarea" />
                        <div className="d-grid px-0">
                           <Button onClick={uploadPost} variant="primary" size="lg">
                              Post!
                           </Button>
                        </div>
                     </Row>
                  </div>
               </main>
            </div>)
            :
            (<div className="text-center">
               <main style={{ padding: "1rem 0" }}>
                  <h2>Must own an NFT to post</h2>
               </main>
            </div>)
         }

         <p>&nbsp;</p>
         <hr />
         <p className="my-auto">&nbsp;</p>
         {posts.length > 0 ?
            posts.map((post, key) => {
               return (
                  <div key={key} className="col-lg-12 my-3 mx-auto" style={{ width: '1000px' }}>
                     <Card border="primary">
                        <Card.Header>
                           <img
                              className='mr-2'
                              width='30'
                              height='30'
                              src={post.author.avatar}
                           />
                           <small className="ms-2 me-auto d-inline">
                              {post.author.username}
                           </small>
                           <small className="mt-1 float-end d-inline">
                              {post.author.address}
                           </small>
                        </Card.Header>
                        <Card.Body color="secondary">
                           <Card.Title>
                              {post.content}
                           </Card.Title>
                        </Card.Body>
                        <Card.Footer className="list-group-item">
                           <div className="d-inline mt-auto float-start">Tip Amount: {ethers.utils.formatEther(post.tipAmount)} ETH</div>
                           {address === post.author.address || !hasProfile ?
                              null : <div className="d-inline float-end">
                                 <Button onClick={() => tip(post)} className="px-0 py-0 font-size-16" variant="link" size="md">
                                    Tip for 0.1 ETH
                                 </Button>
                              </div>}
                        </Card.Footer>
                     </Card>
                  </div>)
            })
            : (
               <div className="text-center">
                  <main style={{ padding: "1rem 0" }}>
                     <h2>No posts yet</h2>
                  </main>
               </div>
            )}

      </div >
   );
}

export default Home