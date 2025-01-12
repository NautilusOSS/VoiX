import "./Participate.scss";
import { ReactElement, useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import { LoadingTile, useLoader, useSnackbar } from "@repo/ui";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import { BlockClient, CoreAccount, CoreNode, NodeClient } from "@repo/algocore";
import voiStakingUtils from "../../utils/voiStakingUtils";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";
import axios from "axios";
import Register from "./Register/Register";
import { Button } from "@mui/material";
import { loadAccountData } from "../../Redux/staking/userReducer";
import algosdk from "algosdk";

function Participate(): ReactElement {
  const { activeAccount, transactionSigner } = useWallet();
  const dispatch = useAppDispatch();
  const { showLoader, hideLoader } = useLoader();
  const { showException, showSnack } = useSnackbar();
  const [isRegisterVisible, setRegisterVisibility] = useState<boolean>(false);
  const [txnId, setTxnId] = useState<string>("");
  const [txnMsg, setTxnMsg] = useState<string>("");
  const [isParticipating, setIsParticipating] = useState<boolean>(false);

  useEffect(() => {
    async function checkParticipationStatus() {
      if (!activeAccount) return;

      try {
        const algodClient = voiStakingUtils.network.getAlgodClient();
        const status = await algodClient.status().do();
        const lastRound = status["last-round"];
        const accountInfo = await algodClient
          .accountInformation(activeAccount.address)
          .do();
        setIsParticipating(
          !!accountInfo.participation &&
            lastRound < (accountInfo.participation["vote-last-valid"] || 0)
        );
      } catch (e) {
        showException(e);
      }
    }

    checkParticipationStatus();
  }, [activeAccount, showException]);

  async function deRegister() {
    if (!activeAccount) return;
    try {
      showLoader("DeRegistering your participation key");
      const atc = new algosdk.AtomicTransactionComposer();
      const algodClient = voiStakingUtils.network.getAlgodClient();
      const suggestedParams = await algodClient.getTransactionParams().do();
      const keyRegTxn =
        algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject({
          from: activeAccount.address,
          suggestedParams,
          note: new Uint8Array(Buffer.from("voix:uparticipate0")),
        });
      atc.addTransaction({ txn: keyRegTxn, signer: transactionSigner });
      const {
        txIDs: [txnId],
      } = await atc.execute(algodClient, 4);
      setTxnId(txnId);
      setTxnMsg("You have deregistered successfully.");
      dispatch(loadAccountData(activeAccount.address));
    } catch (e) {
      showException(e);
    } finally {
      hideLoader();
    }
  }

  return (
    <div className="overview-wrapper">
      <div className="overview-container">
        <div className="overview-header">
          <div>Account</div>
        </div>
        <div className="overview-body">
          {activeAccount && (
            <div className="participation-status">
              <p>
                Status:{" "}
                {isParticipating ? "Participating" : "Not participating"}
              </p>
            </div>
          )}
          <div className="overview-button-group">
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              onClick={() => {
                setRegisterVisibility(true);
              }}
            >
              Register
            </Button>
            {activeAccount ? (
              <>
                <Register
                  show={isRegisterVisible}
                  onClose={() => {
                    setRegisterVisibility(false);
                  }}
                  //accountData={accountData}
                  address={activeAccount.address}
                  onSuccess={(txnId: string) => {
                    setTxnId(txnId);
                    setTxnMsg("You have registered successfully.");
                    setRegisterVisibility(false);
                    dispatch(loadAccountData(activeAccount.address));
                  }}
                ></Register>
                <Button onClick={deRegister}>Deregister</Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Participate;
