import React from "react";
import { Box, Typography, Link, Button, Stack } from "@mui/material";
import styled from "@emotion/styled";

interface BannerProps {
  maxWidth?: string;
}
const BannerWrapper = styled(Box)`
  /* margin: 2px; */
  overflow: hidden;
  .button {
    font-size: 0.9rem;
  }

  @media (max-width: 640px) {
    /* max-width: 90vw; */
    margin-inline: auto;

    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }
    .button {
      font-size: small;
      background: hsl(0, 0%, 0%, 0.8);
      border-radius: 8px;
      backdrop-filter: blur(5px);
      transition: color 0.3s ease-in-out;
      :hover {
        background: hsl(0, 0%, 0%, 0.5);
      }
    }
  }
`;
const Banner: React.FC<BannerProps> = (props) => {
  return (
    <BannerWrapper
      sx={{
        background: "url(/happy.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        padding: "16px",
        textAlign: "center",
        borderRadius: "8px",
        mb: 2,
        // width: "100%",

        // maxWidth: props.maxWidth || "100%",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Got Voi?
      </Typography>

      <Stack
        className="buttons"
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        <Button
          component={Link}
          className="button"
          href="https://www.mexc.com/exchange/VOI_USDT"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          MEXC
        </Button>
        {/*<Button
          component={Link}
          className="button"
          href="https://www.coinstore.com/spot/VOIUSDT"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Coinstore
        </Button>
        */}
        <Button
          component={Link}
          className="button"
          href="https://app.aramid.finance/bridge/Base/Voi/USDC/Aramid%20USDC"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Aramid Bridge
        </Button>
        <Button
          component={Link}
          className="button"
          href="https://voi.humble.sh"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Humble Swap
        </Button>
        {/*
        <Button
          component={Link}
          className="button"
          href="https://medium.com/@voifoundation/staking-program-how-to-guide-382ea5085dab"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Staking Guide
        </Button>
        */}
         <Button
          component={Link}
          className="button"
          href="https://faucet.voirewards.com/"
          target="_blank"
          rel="noopener"
          sx={{ color: "#fff", textDecoration: "none" }}
        >
          Voi Fountain
        </Button>

      </Stack>
    </BannerWrapper>
  );
};

export default Banner;
