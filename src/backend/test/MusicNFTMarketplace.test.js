const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("MusicNFTMarketplace", function(){
    let nftMarketplace;
    let deployer , artist , user1, user2,users;
    let royaltyFee = toWei(0.01); // 1 ether = 10^18 wei
    let URI = "https://bafybeihdjb6no6g6narydsjmzz7rilgbbujfncnvt7x6hmmcknsz6yvqcu.ipfs.nftstorage.link/";
    let prices = [toWei(1),toWei(2),toWei(3),toWei(4),toWei(5),toWei(6),toWei(7),toWei(8)];
    let deploymentFee = toWei(prices.length * 0.01);

    beforeEach(async function(){
        // get ContractFactory & Singers here
        const NFTMarketplaceFactory = await ethers.getContractFactory("MusicNFTMarketplace");
        [deployer,artist,user1,user2,...users] = await ethers.getSigners();

        // Deploy music nft market place contrace
        nftMarketplace = await NFTMarketplaceFactory.deploy(
            royaltyFee,
            artist.address,
            prices,
            {
                value : deploymentFee
            }
        );

    });

    describe("Deployment",function(){
        it("Should Trace Name, Symbol, URI, RoyaltyFee and Artist ",async function(){
            const nftName = "DAppFi";
            const nftSymbol = "DAPP";
            expect(await nftMarketplace.name()).to.equal(nftName);
            expect(await nftMarketplace.symbol()).to.equal(nftSymbol);
            // expect(await nftMarketplace.baseURI()).to.equal(URI);
            expect(await nftMarketplace.royaltyFee()).to.equal(royaltyFee);
            expect(await nftMarketplace.artist()).to.equal(artist.address); 
        });


        it("Should mint then list all the music nfts", async function(){
            expect(await nftMarketplace.balanceOf(nftMarketplace.address)).to.equal(8);

            // get each marketItems from the array then check fields to ensure they are correct
            await Promise.all(prices.map(async(i,indx)=>{
                const item = await nftMarketplace.marketItems(indx);
                expect(item.tokenId).to.equal(indx);
                expect(item.seller).to.equal(deployer.address);
                expect(item.price).to.equal(i);
            }))

        });

        it("Ehter Balance should equal to deployment fees",async function(){
            expect(await ethers.provider.getBalance(nftMarketplace.address)).to.equal(deploymentFee);
        });

    });

    describe("Updating Royalty Fee",function(){
        it("Only Deployer should be able to update royalty fee",async function(){
            const fee = toWei(0.02)
            await nftMarketplace.updateRoyaltyFee(fee)
            await expect(
                nftMarketplace.connect(user1).updateRoyaltyFee(fee)
            ).to.be.revertedWith("Ownable : caller is not the owner");
            expect(await nftMarketplace.royaltyFee()).to.equal(fee)
        });
    });

})