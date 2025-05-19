// Server-side Pinata upload utility
// Requires: npm install axios form-data
import axios from "axios";
import FormData from "form-data";

// This utility should only be used server-side (e.g., in API routes), never in the browser!
// You must set PINATA_JWT in your environment variables (server-side only)

export async function uploadImageToPinata(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", fileBuffer, { filename: fileName });

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
    }
  );

  const { IpfsHash } = res.data;
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}
