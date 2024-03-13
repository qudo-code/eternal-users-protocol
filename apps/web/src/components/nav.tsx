import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {useWallet } from '@solana/wallet-adapter-react';

export function Nav() {
    const { publicKey, connected } = useWallet();
  
    return (
      <nav className="sticky top-0 flex justify-between items-center w-screen px-6 py-3 z-10">
      <h2 className="text-2xl font-semibold">EUP</h2>
      <div className="flex gap-3 flex-wrap">
          <WalletMultiButton>
              {connected ? `${publicKey?.toBase58().slice(0, 6)}...` : <>
                  <p>
                      Connect Wallet
                  </p>
              </>}
          </WalletMultiButton>
      </div>
      </nav>
    );
  }