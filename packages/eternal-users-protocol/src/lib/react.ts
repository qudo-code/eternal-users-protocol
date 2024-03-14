import type { Eup, State, User, DraftUser, Color } from './types';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity, type WalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import imageCompression from 'browser-image-compression';
import { publicKey } from '@metaplex-foundation/umi';
import {
    LeafSchema,
    findLeafAssetIdPda,
    mintToCollectionV1,
    parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum';
import { useParams } from 'react-router-dom';


// Devnet
export const COLLECTION = "8NUeQo6mEKaWEuc8kWQaRoSj2rP8SQWSy8JBKaVdw8jJ";
export const MERKLE_TREE = "FCY1zKx6MoMud2icXbnjwdznNGVKMCRp9NFL1x5Hi6Tv";
export const RPC_ENDPOINT = "https://devnet.admin6074.workers.dev/"

export const useUmi = (wallet: WalletAdapter, rpc: string) => {
  const umi = createUmi(rpc, { commitment: 'confirmed' });
  umi
    .use(irysUploader({ priceMultiplier: 1.5 }))
    .use(mplTokenMetadata())
    .use(dasApi())
    .use(walletAdapterIdentity(wallet));
  return umi;
}

export function useEup(rpc: string = RPC_ENDPOINT): Eup {
    let { id: userId } = useParams();

    const [ draft, setDraft ] = useState<User>({
        name: "",
        image: "",
    });

    const [ user, setUser ] = useState<User>({
        id: "",
        name: "",
        image: "",
    });

    const [ state, setState ] = useState<State>("fetching");
    const [ error, setError ] = useState<string>("");

    const wallet = useWallet();

    const umi = useUmi(wallet, rpc);

    async function resolveUser() {
        try {
            const response = await umi.rpc.searchAssets({
                grouping: ["collection", COLLECTION],
                creator: publicKey(userId),
                creatorVerified: true,
                compressed: true,
                page: 1, // Starts at 1
                limit: 1000
            });

            const [ profileNft ] = response.items.reverse();

            const metadata = await fetch(profileNft.content.json_uri).then((res) => res.json());
            
            console.log("METADATA", metadata)
            const user = {
                id: profileNft.id,
                name: metadata.name,
                image: metadata.image,
                description: metadata.description,
                color: metadata.color,
                discord: metadata.discord,
                twitter: metadata.twitter,
                telegram: metadata.telegram,
                website: metadata.website
            } as User;

            if(!user) return;

            setDraft(user);
            setUser(user);

            setState("resting")
        } catch (error) {
            setState("error");
            console.log(error);

            setError(String(error))
        }
    }

    async function save(user: User) {
        setError("");
        setState("uploading");

        try {
            const tree = publicKey(MERKLE_TREE);
            const collection = publicKey(COLLECTION);
        
            const uri = await umi.uploader.uploadJson(user);

            setState("updating");

            const { signature } = await mintToCollectionV1(umi, {
                leafOwner: umi.payer.publicKey,
                merkleTree: tree,
                collectionMint: collection, 
                payer: umi.payer,
                metadata: {
                    name: user.name,
                    uri: uri,
                    sellerFeeBasisPoints: 0,
                    collection: { key: collection, verified: true },
                    creators: [
                        {
                            address: umi.identity.publicKey,
                            verified: true,
                            share: 100
                        },
                    ],
                },
            })
            .sendAndConfirm(umi);

            const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
                umi,
                signature
            );
    
            const assetId = findLeafAssetIdPda(umi, {
                merkleTree: tree,
                leafIndex: leaf.nonce,
            })[0];
    
            setState("resting");
        } catch (error) {
            console.log(error);
            setState("error");
            setError(String(error));
        }
    }

    // Init client & resolve user whenever wallet changes 
    useEffect(() => {
        if(
            !wallet.publicKey ||
            !wallet.connected ||
            user.id
        ) return;
        
        resolveUser()
    }, [wallet.publicKey, wallet.connected]);

    return {
        draft,
        user,
        state,
        error,

        save: () => save(draft),
        reset: () => (setDraft({
            ...draft,
            image: user.image
        })),
        set: {
            color: (color: Color) => {
                setDraft({
                    ...draft,
                    color,
                })
            }
        },
        input: {
            name: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                setDraft({
                    ...draft,
                    name: value,
                })
            },
            description: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                const { value } = e.target;
                
                setDraft({
                    ...draft,
                    description: value,
                })
            },
            discord: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                
                setDraft({
                    ...draft,
                    discord: value,
                })
            },
            twitter: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                setDraft({
                    ...draft,
                    twitter: value,
                })
            },
            telegram: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                setDraft({
                    ...draft,
                    telegram: value,
                })
            },
            website: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                setDraft({
                    ...draft,
                    website: value,
                })
            },
            image: (e: React.ChangeEvent<HTMLInputElement>) => {
                const imageToUpload = e.target.files[0] as File;

                if(!imageToUpload) return;

                imageCompression(imageToUpload, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                }).then((compressed) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressed);
                    reader.onload = () => {
                        resolve(reader.result as string);
                    }
                    reader.onerror = error => reject(error);
                })).then((result) => {
                    setDraft({
                        ...draft,
                        image: result as string,
                    })
                });
            },
        },
    }
}