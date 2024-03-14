import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Home()  {
    const { publicKey, connected } = useWallet();

    return (
        <div className="grid md:grid-cols-2 min-h-[75vh] items-center max-w-6xl mx-auto">
            <div>
                <h2 className="text-6xl font-bold">Eternal Users Protocol</h2>
                <p className="opacity-80 mb-5 text-xl">On-chain user profile hosted on Arweave, <br /> managed on Solana.</p>
                
                {connected && publicKey ?
                    (<a href={`/#/${publicKey?.toBase58()}`} className="btn btn-success text-lg">My Profile</a>) : (
                    <WalletMultiButton>
                        {connected ? `${publicKey?.toBase58().slice(0, 6)}...` : <>
                            <p className="text-lg">
                                Connect Wallet
                            </p>
                        </>}
                    </WalletMultiButton>
                )}
            </div>
            <div>
                <img src="/example.png" className="" alt="" />
            </div>
        </div>
    );
}