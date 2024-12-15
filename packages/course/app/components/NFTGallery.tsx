import { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { YiDengERC721Coin__factory } from "@/app/abi/typechain-types";
import { ethers } from "ethers";

interface Props {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  account: string | undefined;
}

interface NFTData {
  tokenId: string;
  name: string;
  description: string;
  image: string;
}

export default function NFTGallery({ provider, signer, account }: Props) {
  const [userNFTs, setUserNFTs] = useState<NFTData[]>([]);
  const [minting, setMinting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS || "";

  const loadedRef = useRef(false);

  const loadNFTs = useCallback(async () => {
    if (!signer || !account || !provider || loading) return;
    setLoading(true);

    try {
      const nft = YiDengERC721Coin__factory.connect(nftAddress, signer);
      const balance = await nft.balanceOf(account);
      const balanceNum = Number(balance);

      const nfts: NFTData[] = [];

      for (let tokenId = 0; tokenId < balanceNum; tokenId++) {
        try {
          const tokenURI = await nft.tokenURI(tokenId);
          let nftData;
          try {
            nftData = JSON.parse(tokenURI);
          } catch {
            nftData = {
              name: `NFT #${tokenId}`,
              description: "YiDeng NFT",
              image: tokenURI
            };
          }

          nfts.push({
            tokenId: tokenId.toString(),
            name: nftData.name || `NFT #${tokenId}`,
            description: nftData.description || "YiDeng NFT",
            image: nftData.image || tokenURI
          });
        } catch (e) {
          console.error(`加载 token ${tokenId} 失败:`, e);
          continue;
        }
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error("加载NFT失败:", error);
    } finally {
      setLoading(false);
    }
  }, [signer, account, provider, nftAddress, loading]);

  useEffect(() => {
    if (account && !loading && !loadedRef.current) {
      loadedRef.current = true;
      loadNFTs();
    }
  }, [account, loadNFTs]);

  const mintNFT = async () => {
    if (!provider || !signer || !account || !imageUrl) {
      console.error("缺少必要参数或图片URL");
      return;
    }
    setMinting(true);
    
    try {
      const nft = YiDengERC721Coin__factory.connect(nftAddress, signer);
      
      const metadata = {
        name: "YiDeng NFT",
        description: "YiDeng Course NFT",
        image: imageUrl,
        attributes: []
      };

      const tx = await nft.safeMint(
        account,
        JSON.stringify(metadata),
        {
          gasLimit: 500000
        }
      );

      console.log("铸造交易已发送:", tx.hash);
      const receipt = await provider.waitForTransaction(tx.hash);

      if (receipt?.status === 1) {
        console.log("NFT铸造成功");
        setImageUrl("");
        loadedRef.current = false;
        await loadNFTs();
      } else {
        throw new Error("铸造交易失败");
      }
    } catch (error) {
      console.error("铸造NFT时出错:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        我的 NFT {loading && "(加载中...)"}
      </Typography>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <TextField
          label="图片URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
          style={{ marginRight: "10px" }}
          helperText="请输入有效的图片URL"
        />
        <Button
          variant="contained"
          onClick={mintNFT}
          disabled={minting || !account || !imageUrl}
        >
          {minting ? "铸造中..." : "铸造新 NFT"}
        </Button>
      </div>

      <Grid container spacing={2}>
        {userNFTs.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.tokenId}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {nft.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Token ID: {nft.tokenId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {nft.description}
                </Typography>
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      marginTop: "10px",
                      borderRadius: "4px"
                    }}
                    onError={(e) => {
                      console.error(`图片加载失败: ${nft.image}`);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Typography color="error">图片地址未设置</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
