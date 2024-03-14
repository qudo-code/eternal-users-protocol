import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {useWallet } from '@solana/wallet-adapter-react';
import { User } from 'lucide-react';

export function Nav() {
    const { publicKey, connected } = useWallet();
  
    return (
      <nav className="sticky nav top-0 flex justify-between items-center px-6 py-3 z-10">
        <a className="text-2xl font-semibold" href="/">
            <p>EUP</p>
            <p className="text-xs opacity-50">Eternal Users Protocol</p>
        </a>
        <div className="flex gap-3 flex-wrap">
            {publicKey && connected && (
                <a href={`/#/${publicKey?.toBase58()}`} className="btn btn-outline">
                    <User size={24} />
                </a>
            )}
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