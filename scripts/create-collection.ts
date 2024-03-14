import 'dotenv/config'

import bs58 from 'bs58';
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createV1 } from '@metaplex-foundation/mpl-token-metadata'
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { keypairIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

export const toBytes = (pk) => new Uint8Array(Array.from(JSON.parse(pk)));

(async () => {
    const umi = createUmi(process.env.RPC || "");
    const keypair = umi.eddsa.createKeypairFromSecretKey(toBytes(process.env.KEYPAIR));

    umi
    .use(keypairIdentity(keypair))
    .use(irysUploader({
        priceMultiplier: 1.5
    }))
    .use(mplTokenMetadata());

    const jsonUri = await umi.uploader.uploadJson({
        name: 'Eternal Users Protocol',
        symbol: 'EUP',
        description: 'On-chain user profiles.',
        seller_fee_basis_points: 0,
        image: "",
        external_url: 'https://eup.sh/',
        collection: {
            name: 'Eternal Users Protocol',
        },
        attributes: [],
        properties: {
            category: 'image',
            creators: [
                {
                    address: umi.payer.publicKey,
                    share: 100,
                },
            ],
        },
    });

    const collectionMint = generateSigner(umi);
    
    console.log("Creating new collection...");

    const result = await createV1(umi, {
        mint: collectionMint,
        name: 'Eternal Users Protocol',
        uri: jsonUri,
        sellerFeeBasisPoints: percentAmount(0),
        isCollection: true,
        tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);

    console.log("Minting new collection...");

    const mintResult = await mintV1(umi, {
        mint: collectionMint.publicKey,
        amount: 1,
        tokenOwner: umi.payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);

    console.log("✅ Collection created!\nMint: ", collectionMint.publicKey);
})();