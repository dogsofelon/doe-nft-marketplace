import { Input } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";


function SearchCollections({setInputValue}){

    function onChange(value) {
        setInputValue(value);
    }

    return (
        <>
        <Input placeholder='Search NFT' />
        </>
    )
}
export default SearchCollections;