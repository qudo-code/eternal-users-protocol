import type { Eup, Item, State } from './types';
import { addItem, fetchItems, resolve, save } from "./core";

import { createUmi  } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity, type WalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export const useUmi = (wallet: WalletAdapter, rpc: string) => {
  const umi = createUmi(rpc, { commitment: 'confirmed' });
  umi
    .use(irysUploader({ priceMultiplier: 1.5 }))
    .use(mplTokenMetadata())
    .use(dasApi())
    .use(walletAdapterIdentity(wallet));
  return umi;
}

export function useEup(rpc: string = "https://api.devnet.solana.com"): Eup {
    const [ draft, setDraft ] = useState<Item>({
        name: "",
        image: ""
    });

    const [ value, setValue ] = useState<Item>({
        id: "",
        name: "",
        image: ""
    });

    const [ state, setState ] = useState<State>("resting");
    const [ items, setItems ] = useState<Item[]>([])
    const [ error, setError ] = useState<string>("")

    const wallet = useWallet();

    const umi = useUmi(wallet, rpc);

    async function resolveUser() {
        setError("");
        setState("fetching");

        try {
            const { user, items } = await resolve(wallet.publicKey);
    
            setValue(user);
            setItems(items);

            setState("resting")
        } catch (error) {
            setState("error");
            console.log(error);

            setError(String(error))
        }
    }

    // Init client & resolve user whenever wallet changes 
    useEffect(() => {
        if(!wallet.publicKey || !wallet.connected) return;
        
        resolveUser()
    }, [wallet]);

    return {
        draft,
        value,
        items,
        state,
        error,

        save: () => save(draft, wallet.publicKey),
        reset: () => (setDraft(value)),
        set: {
            name: (value: string) => {
                setDraft({
                    ...draft,
                    name: value,
                })
            },
            image: (value: File[]) => {
                const [ image ] = value;

                setDraft({
                    ...draft,
                    image,
                })
            }
        },
        add: {
            item: async (data: Item) => addItem(data, wallet.publicKey)
        }
    }
}