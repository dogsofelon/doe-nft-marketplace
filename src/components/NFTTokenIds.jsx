import React, { useState, useEffect } from "react";
import { getNativeByChain } from "helpers/networks";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import { ConsoleSqlOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";
import NftService from '../services/nft.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@mui/material/Grid';
import { Input, Select } from 'antd';
import { ETHLogo} from "./Chains/Logos";
import { CircularProgress } from "@mui/material";


const { Meta } = Card;
const { Option } = Select;

const styles = {
  NFTs: {
    width: "100%",
    height: "100%",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
  infiniteScroll: {
    width: "100%",
    height: "100%"
  },
  nftImage : {
    height: "200",
    width: "200"
  },
  listedNft : {
    color: "#30af5d",
    fontSize: "20px",
    fontWeight: "bold",
  },
  notListedNft : {
    color: "#ffd1d1",
    fontSize: "20px",
  },
  nftPrice : {
    fontSize: "33px",
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "center",
  }
};

function NFTTokenIds() {

  const [inputValue, setInputValue] = useState("");
  const [offset, setOffset] = useState(200);
  const [sortBy, setSortBy] = useState(1);
  const [doeNfts, setDoeNfts] = useState(null);
  const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(inputValue);
  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();
  const nativeName = getNativeByChain(chainId);
  const contractABIJson = JSON.parse(contractABI);
  const { Moralis } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItems");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  );
  const purchaseItemFunction = "createMarketSale";

  const tokenContrat = "0xA6c5C4950A2bFEbD962c26432cdb5D79c9D6F09F";

  useEffect(() => {
    NftService.fetch(offset, sortBy).then(result => {
      setDoeNfts(result.data);
    });
  }, [])

  async function purchase() {
    setLoading(true);
    const tokenDetails = getMarketItem(nftToBuy);
    const itemID = tokenDetails.itemId;
    const tokenPrice = tokenDetails.price;
    const ops = {
      contractAddress: marketAddress,
      functionName: purchaseItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: tokenContrat,
        itemId: itemID,
      },
      msgValue: tokenPrice,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateSoldMarketItem();
        succPurchase();
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        failPurchase();
      },
    });
  }

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    console.log(nft.image);
    setVisibility(true);
  };

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateSoldMarketItem() {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("MarketItems");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  const getMarketItem = (nft) => {
    let nftId = String(nft?.nft_id);
    const result = fetchMarketItems?.find(
      (e) =>
        e.tokenId === nftId &&
        e.sold === false &&
        e.confirmed === true
    );
    return result;
  };

  const loadMoreNfts = () => {
    let newOffset = offset + 200;
    NftService.fetch(newOffset, sortBy).then(result => setDoeNfts(result.data));
    setOffset(newOffset);
  };

  const orderChanged = (value) => {
    let sortOrder = value;
    NftService.fetch(offset, sortOrder).then(result => setDoeNfts(result.data));
    setSortBy(sortOrder);
  }

  const searchNft = (e) => {
    let value = e.target.value;
    console.log(value);
  }

  if(doeNfts==null){
    return <CircularProgress />
  }

  return (
      <>
        
        <div>
          <div style={styles.NFTs}>
            <Grid container justifyContent="flex-end" paddingBottom="20px">
              <Grid item>
                <Input placeholder="Search NFT" onChange={searchNft} />
              </Grid>
              <Grid item>
                <Select
                  defaultValue={1}
                  onChange={orderChanged}
                >
                  <Option value={1}>ID: Low to High</Option>
                  <Option value={2}>ID: High to Low</Option>
                  <Option value={3}>Rarity: Low to High</Option>
                  <Option value={4}>Rarity: High to Low</Option>
                </Select>
              </Grid>
            </Grid>
            <InfiniteScroll 
              dataLength={doeNfts != null ? doeNfts.length : 0} 
              hasMore={doeNfts != null ? doeNfts.length<=10000 : false}
              next={()=>loadMoreNfts()}
              style={styles.infiniteScroll}
            >
            <Grid container spacing={2} justifyContent="center">
            {doeNfts!= null && doeNfts.map((nft, index) => (
                <Grid item lg={1}>
                <Card
                  hoverable
                  actions={[
                    <Tooltip title="Buy NFT">
                      {getMarketItem(nft) && (
                        <ShoppingCartOutlined style={styles.listedNft} onClick={() => handleBuyClick(nft)} />
                      )}
                      {!getMarketItem(nft) && (
                        <ShoppingCartOutlined style={styles.notListedNft} onClick={() => handleBuyClick(nft)} />
                      )}
                    </Tooltip>,
                  ]}
                  style={{ border: "2px solid #e7eaf3" }}
                  bodyStyle={{padding: "2px"}}
                  cover={
                    <Image
                      preview={false}
                      src={"/static/images/nft/"+nft.nft_id+".png"}
                      alt=""
                      style={styles.nftImage}
                      width="200"
                      height="200"
                    />
                  }
                  key={index}
                >
                  <Meta title={nft.nft_name} />
                </Card>
                </Grid>
              ))}
              </Grid>
          </InfiniteScroll>
          </div>
          {getMarketItem(nftToBuy) ? (
            <Modal
              title={`Buy NFT #${nftToBuy?.nft_id}`}
              visible={visible}
              onCancel={() => setVisibility(false)}
              onOk={() => purchase()}
              okText="Buy"
            >
              <Spin spinning={loading}>
                <div
                  style={{
                    width: "200px",
                    margin: "auto",
                    textAlign: "center"
                  }}
                >
                  <img  
                    src={"/static/images/nft/"+nftToBuy?.nft_id+".png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  />
                  <span style={styles.nftPrice}><ETHLogo></ETHLogo>&nbsp;{getMarketItem(nftToBuy).price / ("1e" + 18)}</span>
                </div>
              </Spin>
            </Modal>
          ) : (
            <Modal
              title={`Buy NFT #${nftToBuy?.nft_id}`}
              visible={visible}
              onCancel={() => setVisibility(false)}
              onOk={() => setVisibility(false)}
            >
              <img
                src={"/static/images/nft/"+nftToBuy?.nft_id+".png"}
                style={{
                  width: "200px",
                  margin: "auto",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
              <Alert
                message="This NFT is currently not listed."
                type="warning"
              />
            </Modal>
          )}
        </div>
      </>
    );
}

export default NFTTokenIds;
