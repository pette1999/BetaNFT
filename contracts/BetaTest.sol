// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "hardhat/console.sol";


contract BetaTest is ERC721AUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using StringsUpgradeable for uint256;

    CountersUpgradeable.Counter private _tokenIds;
    uint256 public  MAX_SUPPLY;
    uint256 public  PRICE ;
    uint256 public  MAX_PER_MINT ;
    uint256 private MAX_RESERVED_MINTS ;
    uint256 private RESERVED_MINTS ;
    string public baseExtension;
    string public baseTokenURI;
    bool public paused;
    bool public locked;

    function initialize() public initializer {
        __Ownable_init();
        __ERC721A_init("Beta", "BETA");
        MAX_SUPPLY = 1500;
        PRICE = 10 ether;
        MAX_PER_MINT = 1500;
        MAX_RESERVED_MINTS = 1500;
        RESERVED_MINTS = 0;
        baseTokenURI = "ipfs://QmWKFFEHhwVNDx7eScp8XDP1wEQavV3SRDasCDKZt1mpHB/";
        baseExtension = ".json";
        paused = false;
        locked = false;
    }

    function ownershipOf(uint256 index) public view returns (address) {
      return ownerOf(index);
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 0;
    }

    function _baseURI() internal view virtual override returns (string memory) {
       return baseTokenURI;
    }

    function isLocked() public view returns(bool) {
      return locked;
    }

    modifier isPaused() {
      require(!paused, "Smart contract is paused currently !!");
      _;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    // set new price of the NFT
    function setCost(uint256 _newCost) public onlyOwner {
      PRICE = _newCost;
    }
    
    // set new max supply
    function setMaxSupply(uint256 _newmaxMintAmount) public onlyOwner {
      MAX_SUPPLY = _newmaxMintAmount;
    }

    // set lock for transfer
    function setLocked(bool _locked) public onlyOwner {
      locked = _locked;
    }

    // set new base extension
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
      baseExtension = _newBaseExtension;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {
      require(!locked, "The contract is locked!");
      safeTransferFrom(from, to, tokenId, _data);
    }

    function togglePause() public onlyOwner {
      paused = !paused;
    }

    function safeMint(address to, uint256 quantity_) public payable onlyOwner {
      uint256 supply = totalSupply();

      require(!paused, "Contract is paused!");
      require(supply + quantity_ <= MAX_SUPPLY, "Not enough NFTs!");
      require(quantity_ > 0 && quantity_ <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");

      if (_msgSender() != owner()) {
        require(msg.value >= PRICE * quantity_,"Not enough ether to purchase NFTs.");
      }

      for (uint256 i=1; i<=quantity_; i++) {
        _safeMint(to, 1);
      }
    }

    // View Function
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension)) : "";
    }

    //Withdraw money in contract to Owner
    function withdraw() public onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}