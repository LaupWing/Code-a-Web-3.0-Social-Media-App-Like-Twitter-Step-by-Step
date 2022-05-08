//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Decentratwitter is ERC721URIStorage {
   uint256 public tokenCount;
   uint256 public postCount;

   struct Post {
      uint256 id;
      string hash; //points to the location of the post
      uint256 tipAmount;
      address payable author;
   }

   constructor() ERC721("Decentratwitter", "DAPP"){}
}
