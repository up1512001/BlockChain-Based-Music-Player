// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MusicNFTMarketplace is ERC721("DAppFi","DAPP") , Ownable {
    string public baseUrl = "bafybeihdjb6no6g6narydsjmzz7rilgbbujfncnvt7x6hmmcknsz6yvqcu.ipfs.nftstorage.link/";

    string public baseExtension = ".json";

    address public artist;

    uint256 public royaltyFee;

    struct MarketItem{
        uint256 tokenId;
        address payable seller;
        uint256 price;
    }
    MarketItem[] public marketItems;

    constructor(
        uint256 _royaltyFee,
        address _artist,
        uint256[] memory _prices
    ) payable{
        require(
            _prices.length * _royaltyFee == msg.value,
            "Deployer must pay royalty fee for each token listed on the marketplace"
        );
        royaltyFee = _royaltyFee;
        artist = _artist;
        for(uint8 i=0;i<_prices.length;i++){
            require(_prices[i] > 0 , "Price Must be greater than 0");
            _mint(address(this), i);
            marketItems.push(MarketItem(i,payable(msg.sender),_prices[i]));

        }

    }

    // update royalty fee of contract
    function updateRoyaltyFee(uint256 _royaltyFee) external onlyOwner{
        royaltyFee = _royaltyFee;
    }



}
