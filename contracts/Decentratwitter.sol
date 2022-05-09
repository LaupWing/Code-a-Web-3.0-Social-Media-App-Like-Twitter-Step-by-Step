//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Decentratwitter is ERC721URIStorage {
   uint256 public tokenCount;
   uint256 public postCount;
   mapping(uint256 => Post) public posts;
   mapping(address => uint256) public profiles;

   struct Post {
      uint256 id;
      string hash; //points to the location of the post
      uint256 tipAmount;
      address payable author;
   }

   event PostCreated(
      uint256 id,
      string hash,
      uint256 tipAmount,
      address payable author
   );
   event PostTipped(
      uint256 id,
      string hash,
      uint256 tipAmount,
      address payable author
   );

   constructor() ERC721("Decentratwitter", "DAPP"){}

   function mint(string memory _tokenURI) external returns(uint256){
      tokenCount++;
      _safeMint(msg.sender, tokenCount);
      _setTokenURI(tokenCount, _tokenURI);
      setProfile(tokenCount);
      return tokenCount;
   }

   function setProfile(uint256 _id) public{
      require(
         ownerOf(_id) == msg.sender,
         "Must own the nft you want to select as profile"
      );
      profiles[msg.sender] = _id;
   }

   function tipPostOwner(uint256 _id) external payable{
      require(_id > 0 && _id <= postCount, "Invalid post id");

      Post memory _post = posts[_id];
      require(_post.author != msg.sender, "Cannot tip your own post");
      _post.author.transfer(msg.value);
      _post.tipAmount += msg.value;

      posts[_id] = _post;

      emit PostTipped(_id, _post.hash, _post.tipAmount, _post.author);
   }
}
