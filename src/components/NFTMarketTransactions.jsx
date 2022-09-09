import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Table, Tag, Space, Button, Modal } from "antd";
import { ETHLogo} from "./Chains/Logos";
import moment from "moment";
import Grid from '@mui/material/Grid';

const styles = {
  table: {
    margin: "0 auto",
    width: "100%",
    height: "100%",
  },
};

function NFTMarketTransactions() {

  const { walletAddress, marketAddress, contractABI } = useMoralisDapp();
  const { Moralis } = useMoralis();

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const cancelListing = "cancelListing";
  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = JSON.parse(contractABI);
  
  const queryItemImages = useMoralisQuery("ItemImages");

  const fetchItemImages = JSON.parse(
    JSON.stringify(queryItemImages.data, [
      "nftContract",
      "tokenId",
      "name",
      "image",
    ])
  );
  const queryMarketItems = useMoralisQuery("MarketItems");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "updatedAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
    ])
  )
    .filter(
      (item) => item.seller === walletAddress || item.owner === walletAddress
    )
    .sort((a, b) =>
      a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0
    );

  function getImage(addrs, id) {
    const img = fetchItemImages.find(
      (element) =>
        element.nftContract === addrs &&
        element.tokenId === id
    );
    return img?.image;
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      key: "item",
      render: (text, record) => (
        <Space size="middle">
          <img src={getImage(record.collection, record.item)} style={{ width: "40px", borderRadius:"4px"}} />
          <span>#{record.item}</span>
        </Space>
      ),
    },
    {
      title: "Transaction Status",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "geekblue";
            let status = "BUY";
            if (tag === false) {
              color = "volcano";
              status = "LISTED";
            } else if (tag === true) {
              color = "green";
              status = "SOLD";
            }
            if (tag === walletAddress) {
              status = "SELL";
            }
            return (
              <Tag color={color} key={tag}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (e) => (
        <Space size="middle">
          <ETHLogo/>
          <span>{e}</span>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (data) => (
        <Space size="middle">
          {data.tags[1]==false && (
            <Button type="primary" danger onClick={() => cancelSell(data)}>Cancel</Button>
          )}
          {data.tags[1]==true && (
            <span></span>
          )}
        </Space>
      ),
    },
  ];

  const data = fetchMarketItems?.map((item, index) => ({
    key: index,
    date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
    item: item.tokenId,
    tags: [item.seller, item.sold],
    price: item.price / ("1e" + 18),
  }));

  async function cancelSell(data) {
    setLoading(true);
    console.log(data);
    const ops = {
      contractAddress: marketAddress,
      functionName: cancelListing,
      abi: contractABIJson,
      params: {
        itemId: data.item,
      },
    };

    console.log(ops);
  
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        deleteFromItems(data.item);
        setAlertMessage("Listing canceled successfully !");
        setShowAlert(true);
        setLoading(false);
      },
      onError: (error) => {
        console.log(error);
        setShowAlert(true);
        setAlertMessage("Unable to cancel the NFT listing !");
        setLoading(false);
      },
    });
  }

  async function deleteFromItems(id) {
    const query = new Moralis.Query('MarketItems')
    query.equalTo('itemId', id)
    const object = await query.first()
    if (object) {
      object.destroy().then(() => {
      }, (error) => {
        console.log(error);
        setShowAlert(true);
        setAlertMessage("Cannot delete the listing.");
      });
    }
  }

  return (
    <>
      <div>
        <div style={styles.table}>
          <Modal
            visible={showAlert}
            onCancel={() => {setShowAlert(false);}}
            onOk={() => {setShowAlert(false);}}
          >
            {alertMessage}
          </Modal>
          <Grid container justifyContent="flex-end" paddingBottom="20px" xs={12}>
            <Table columns={columns} dataSource={data} pagination={{ position: ["none", "none"] }} />
          </Grid>
        </div>
      </div>
    </>
  );
}

export default NFTMarketTransactions;
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Item",
    key: "item",

  },
  {
    title: "Collection",
    key: "collection",
  },
  {
    title: "Transaction Status",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Price",
    key: "price",
    dataIndex: "price",
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
  }
];