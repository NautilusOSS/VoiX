import React, { ReactElement, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel/LeftPanel";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import WalletWidget from "../../Components/WalletWidget/WalletWidget";
import Overview from "../../Pages/Overview/Overview";
import { useWallet } from "@txnlab/use-wallet-react";
import Stake from "../../Pages/Stake/Stake";
import { loadAccountData } from "../../Redux/staking/userReducer";
import Withdraw from "../../Pages/Withdraw/Withdraw";
import Deposit from "../../Pages/Deposit/Deposit";
import Staking from "../../Pages/Staking/Staking";
import Participate from "../../Pages/Participate/Participate";
import Airdrop from "../../Pages/Airdrop/Airdrop";
import Transfer from "../../Pages/Transfer/Transfer";
import ContractPicker from "../../Components/pickers/ContractPicker/ContractPicker";
import Delegate from "../../Pages/Delegate/Delegate";
import ComingSoon from "../../Pages/ComingSoon/ComingSoon";
import Setting from "../../Pages/Setting/Setting";
import voiStakingUtils from "../../utils/voiStakingUtils";
import { CoreAccount } from "@repo/algocore";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";
import { Box, Stack, Typography } from "@mui/material";
import logo from "../../assets/images/full-logo.png";
import MobileMenu from "../../Components/MobilePanel";
import "../App.scss";
import StakingForecast from "@/Pages/StakingForecast/StakingForecast";
import Banner from "@/Components/Banner/Banner";
import DeadlineCountdown from "@/Components/DeadlineCountdown/DeadlineCountdown";

function AppRouter(): ReactElement {
  const deadlines = [
    new Date("2024-10-07T00:00:00Z"),
    new Date("2024-10-14T00:00:00Z"),
    new Date("2024-10-21T00:00:00Z"),
    new Date("2024-10-28T00:00:00Z"),
  ];
  const now = new Date().getTime();
  let whichWeek = 0;
  let whichDeadline = deadlines[deadlines.length - 1];
  for (let i = 0; i < deadlines.length; i++) {
    if (now < deadlines[i].getTime()) {
      whichWeek = i + 1;
      whichDeadline = deadlines[i];
      break;
    }
  }

  const { selectedNode } = useSelector((state: RootState) => state.nodes);
  const { activeAccount } = useWallet();

  const dispatch = useAppDispatch();

  const isAirdrop = document.location?.pathname?.includes("airdrop");
  const isStaking = document.location?.pathname?.includes("staking");
  const isSetting = document.location?.pathname?.includes("setting");
  const isAccount = document.location?.pathname?.includes("account");

  useEffect(() => {
    if (activeAccount?.address) {
      dispatch(loadAccountData(activeAccount.address));
    }
  }, [activeAccount]);

  const [availableBalance, setAvailableBalance] = useState<number>(-1);
  useEffect(() => {
    if (!activeAccount) return;
    const algodClient = voiStakingUtils.network.getAlgodClient();
    algodClient
      .accountInformation(activeAccount.address)
      .do()
      .then((account) => {
        setAvailableBalance(
          new CoreAccount(account as AccountResult).availableBalance()
        );
      });
  }, [activeAccount]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="app-container-body">
          <div className="app-left">
            <LeftPanel></LeftPanel>
          </div>
          <div className="app-right">
            <div className="content-wrapper">
              <div className="content-container">
                <div
                  className="content-header justify-between "
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{ background: "#6f2ae2" }}
                    className="p-2 sm:hidden mr-auto rounded-md! "
                  >
                    <img
                      className=""
                      style={{
                        width: "40px",
                      }}
                      src={logo}
                      alt={"logo"}
                    />
                  </div>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    {availableBalance >= 0 ? (
                      <div className="balance">
                        {(availableBalance / 1e6).toFixed(6)} VOI
                      </div>
                    ) : null}
                  </Box>
                  {/* Wallet connection widget */}
                  <WalletWidget></WalletWidget>
                  {/* Mobile menu */}
                  <div className="sm:hidden">
                    <MobileMenu />
                  </div>
                </div>
                {selectedNode && (
                  <div className="content-body">
                    <Stack spacing={3} direction="column" className="mb-4">
                      {/*
                      <DeadlineCountdown
                        week={whichWeek}
                        deadline={whichDeadline}
                      />
                      */}
                      <Banner></Banner>
                      {activeAccount && (
                        <Routes>
                          <Route
                            path="/overview"
                            element={<Overview></Overview>}
                          ></Route>
                          <Route
                            path="/overview/:contractId"
                            element={<Overview></Overview>}
                          ></Route>
                          <Route
                            path="/stake"
                            element={<Stake></Stake>}
                          ></Route>
                          <Route
                            path="/deposit"
                            element={<Deposit></Deposit>}
                          ></Route>
                          <Route
                            path="/withdraw"
                            element={<Withdraw></Withdraw>}
                          ></Route>
                        <Route
                          path="/transfer"
                          element={<Transfer></Transfer>}
                    ></Route>
                          <Route
                            path="/delegate"
                            element={<Delegate></Delegate>}
                          ></Route>
                          <Route
                            path="/airdrop"
                            element={<Airdrop></Airdrop>}
                          ></Route>
                          {/*
                          <Route
                            path="/staking-forecast"
                            element={<StakingForecast></StakingForecast>}
                          ></Route>
                          <Route
                            path="/staking"
                            element={<Staking></Staking>}
                          ></Route>
                          <Route
                          path="/setting"
                          element={<Setting></Setting>}
                        ></Route>*/}
                          <Route
                            path="/account"
                            element={<Participate></Participate>}
                          ></Route>
                          <Route
                            path="*"
                            element={<Navigate to="/overview" replace />}
                          />
                        </Routes>
                      )}
                      {!activeAccount && (
                        <>
                          <Routes>
                            <Route
                              path="*"
                              element={
                                <Navigate to="/staking-forecast" replace />
                              }
                            />
                          </Routes>
                          <Typography
                            style={{
                              color: "rgba(112, 42, 226, 0.8)",
                              fontWeight: "bold",
                            }}
                            variant="h6"
                            className="text-center"
                          >
                            Connect your wallet or use the forecasting tool
                            below!
                          </Typography>
                          <StakingForecast></StakingForecast>
                        </>
                      )}
                    </Stack>
                  </div>
                )}
                <footer
                  style={{
                    minHeight: "50px",
                  }}
                  className="sm:hidden"
                ></footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
