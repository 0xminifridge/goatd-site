import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3ExecuteFunction, useChain } from "react-moralis";
import spotNFTAbiFuji from '../contracts/spotNFTAbiFuji.json';
import spotTraitsAbiFuji from '../contracts/spotTraitsAbiFuji.json';

function SetApproval() {
  //isApprovedForAll(account, operator) - function imported from OpenZeppelin IERC1155
  //setApprovalForAll(operator, approved) - function imported from OpenZeppelin IERC1155
  const spotTraitsContract = "0x9521807adf320d1cdf87afdf875bf438d1d92d87";
  const spotNFTContract = '';
  const spotTraitsContractFuji = '0xD1cebaDdf3a76CD1E628e8Ce541fC700c64Afe47';
  const spotNFTContractFuji = '0x1BcaC9c748619578B8b420ff4E5536a55441fc42';
    const { account } = useMoralis();
    const { switchNetwork, chainId } = useChain()
    const { data: approvalData, error: approvalError, fetch: approvalFetch, isFetching: approvalFetching, isLoading: approvalLoading } = useWeb3ExecuteFunction({
        abi: spotTraitsAbiFuji,
        contractAddress: spotTraitsContractFuji,
        functionName: "setApprovalForAll",
        params: {
        operator: spotNFTContractFuji,
        approved: true
             },
         });

    const { data: checkApprovedData, error: checkApprovedError, fetch: checkApprovedFetch, isFetching: checkApprovedFetching, isLoading: checkApprovedLoading } = useWeb3ExecuteFunction({
    abi: spotTraitsAbiFuji,
    contractAddress: spotTraitsContractFuji,
    functionName: "isApprovedForAll",
    params: {
        account: account,
        operator: spotNFTContractFuji
            },
        });
    const [traitsApproved, setTraitsApproved] = useState(false)
    
    function changeUITrue() {
        setTraitsApproved(true)
    }
    function changeUIFalse() {
        setTraitsApproved(false)
    }
    const handleSuccessfulApproval = async (tx) => {
        await tx.wait(1)
        changeUITrue()
    }

    useEffect(()=>{
      const checkApproval = async ()=>{
        const result = await checkApprovedFetch();
        if (result) {
          changeUITrue();
        } else changeUIFalse();
      }
      checkApproval()
    },[account, chainId])
  
  
    return (
    <div>
        <button className={!traitsApproved?"m-2 rounded-lg px-4 py-2 border-2 border-gray-200 text-gray-200 hover:bg-gray-200 hover:text-gray-900 duration-300 font-mono font-bold text-base":"m-2 rounded-lg px-4 py-2 border-2 border-gray-200 bg-gray-500 text-gray-900 font-mono font-bold text-base"} 
     onClick={async()=>{
     if(traitsApproved){
        return;
     }
     await approvalFetch({
         onSuccess: handleSuccessfulApproval,
     })
     }}>{traitsApproved?'Traits Approved':'Approve My Traits'}</button>
    </div>
  )
}

export default SetApproval;