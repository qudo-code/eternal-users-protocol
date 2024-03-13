import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Profile()  {
    const navigate = useNavigate();
    const wallet = useWallet();

    return (
        <div>
            {wallet.publicKey?.toBase58()}
        </div>
    );
}