import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { getCollectionsByChain } from "helpers/collections";

export const useNFTBalance = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const NFTCollections = getCollectionsByChain(chainId);
  const [NFTBalance, setNFTBalance] = useState([]);
  const { fetch: getNFTBalance, data, error, isLoading } = useMoralisWeb3ApiCall(account.getNFTs, { chain: chainId, ...options });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      const array = [];
      NFTs.map((nft) => {
        NFTCollections.map((collection) => {
          if(nft.token_address.toLowerCase() == collection.addrs.toLowerCase()){
            array.push(nft);
          }
        })
      })
      array.sort((n1, n2) => {
        if(n1.token_id < n2.token_id){
          return -1;
        }
        if(n1.token_id > n2.token_id){
          return 1;
        }
        return 0;
      })
      setFetchSuccess(true);
      setNFTBalance(array);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
