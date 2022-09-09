export const networkCollections = {
  "0x1": [
    {
      image: "https://dogsofelon.io/img/logo.png",
      name : "Dogs Of Elon",
      addrs: "0xd8cdb4b17a741dc7c6a57a650974cd2eba544ff7",
    }
  ],
  "0x3": [
    {
      image: "https://lh3.googleusercontent.com/BWCni9INm--eqCK800BbRkL10zGyflxfPwTHt4XphMSWG3XZvPx1JyGdfU9vSor8K046DJg-Q8Y4ioUlWHiCZqgR_L00w4vcbA-w=s0",
      name : "FAUCET NFT",
      addrs: "0xA6c5C4950A2bFEbD962c26432cdb5D79c9D6F09F",
    }
  ],
};

export const getCollectionsByChain = (chain) => networkCollections[chain];
