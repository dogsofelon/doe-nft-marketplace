import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Image, Tooltip, Modal, Spin, Button } from "antd";
import { useNFTBalance } from "hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import InfiniteScroll from 'react-infinite-scroll-component';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';


const { Meta } = Card;

function NFTBalance() {

  const { NFTBalance, fetchSuccess } = useNFTBalance();
  const { chainId, marketAddress, contractABI, user } = useMoralisDapp();
  const { Moralis } = useMoralis();
  
  const [visible, setVisibility] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isPriceError, setPriceError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = JSON.parse(contractABI);
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");

  async function list(nft, listPrice) {
    if(isPriceError || price <= 0){
      setVisibility(false);
      setAlertMessage("The specified price is not valid.");
      setShowAlert(true);
      return;
    }
    setLoading(true);
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nft.token_address,
        tokenId: nft.token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        addItemImage();
        succList();
      },
      onError: (error) => {
        setLoading(false);
        failList();
      },
    });
  }

  async function approveAll(nft) {
    setLoading(true);  
    const ops = {
      contractAddress: nft.token_address,
      functionName: "setApprovalForAll",
      abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      params: {
        operator: marketAddress,
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
        updateUserApproval();
        succApprove();
      },
      onError: (error) => {
        setLoading(false);
        setApproved(false);
        failApprove();
      },
    });
  }

  async function updateUserApproval() {
    user.set("isApproved", true);
    await user.save();
    setApproved(true);
  }

  async function isApproved() {
    setApproved(user.get("isApproved"));
  }

  const handleSellClick = (nft) => {
    isApproved();
    setNftToSend(nft);
    setVisibility(true);
  };

  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may list your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToSend.image);
    itemImage.set("nftContract", nftToSend.token_address);
    itemImage.set("tokenId", nftToSend.token_id);
    itemImage.set("name", nftToSend.name);

    itemImage.save();
  }

  const loadMoreNfts = () => {

  }

  const checkPrice = (value) => {
    let isError = isNaN(+value); 
    if(!isError && value <= 0){
      isError = true;
    }
    setPriceError(isError)
    if(!isError){
      setPrice(value);
    }
  }

  const styles = {
    NFTs: {
      width: "100%",
      height: "100%",
    },
    infiniteScroll: {
      width: "100%",
      height: "100%"
    },
    nftImage : {
      height: "106px",
      width: "106px"
    },
    approveBtn : {
      visibility: !approved ? "visible" : "hidden",
    },
    priceStyle : {
      width: "100%",
    },
  };

  return (
    <>
      <div style={styles.NFTs}>
        <Modal
          visible={showAlert}
          title="Error"
          onCancel={() => {setVisibility(true); setShowAlert(false)}}
          onOk={() => {setVisibility(true); setShowAlert(false);}}
        >
          {alertMessage}
        </Modal>
        <InfiniteScroll 
          dataLength={NFTBalance != null ? NFTBalance.length : 0} 
          hasMore={true}
          next={()=>loadMoreNfts()}
          style={styles.infiniteScroll}
        >
        <Grid container spacing={2} justifyContent="center">
        {NFTBalance && NFTBalance.map((nft, index) => (
            <Card
              hoverable
              actions={[
                <Tooltip title="View On Etherscan">
                  <FileSearchOutlined
                    onClick={() =>
                      window.open(
                        `${getExplorer(chainId)}address/${nft.token_address}`,
                        "_blank"
                      )
                    }
                  />
                </Tooltip>,
                <Tooltip title="Sell NFT">
                  <ShoppingCartOutlined onClick={() => handleSellClick(nft)} />
                </Tooltip>,
              ]}
              style={{ border: "2px solid #e7eaf3" }}
              bodyStyle={{padding: "2px"}}
              cover={
                <Image
                  preview={false}
                  src={"/static/images/nft/"+nft.token_id+".png"}
                  alt=""
                  style={styles.nftImage}
                  width="200"
                  height="200"
                />
              }
              key={index}
            >
              <Meta title={"#"+nft.token_id} />
            </Card>
          ))}
          </Grid>
        </InfiniteScroll>
      </div>

      <Modal
        title={`Sell ${nftToSend?.name} #${nftToSend?.token_id}`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => list(nftToSend, price)}
        okText="List"
        footer={[
          <Button style={styles.approveBtn} onClick={() => approveAll(nftToSend)} type="primary">
            Approve
          </Button>,
          <Button onClick={() => list(nftToSend, price)} type="primary">
            List
          </Button>,
           <Button type="primary" danger onClick={() => setVisibility(false)}>
           Cancel
         </Button>
        ]}
      >
        <Spin spinning={loading}>
          <img
            src={"/static/images/nft/"+nftToSend?.token_id+".png"}
            alt=""
            width="200"
            height="200"
            style={{
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <TextField 
            error={isPriceError}
            helperText="Please specify a valid number."
            style={styles.priceStyle}
            label="Price in ETH" variant="filled" 
            onChange={(e) => checkPrice(e.target.value)} ></TextField>
        </Spin>
      </Modal>
    </>
  );
}

export default NFTBalance;
