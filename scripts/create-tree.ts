import 'dotenv/config'

import { keypairIdentity, generateSigner } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createTree } from '@metaplex-foundation/mpl-bubblegum';

import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

(async () => {
    const umi = createUmi(process.env.RPC || "");
    const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(JSON.parse(process.env.KEYPAIR || "")));
    
    umi
    .use(keypairIdentity(keypair))
    .use(irysUploader({ priceMultiplier: 1.5 }))
    .use(mplTokenMetadata())
    .use(dasApi());

    console.log('Creating merkle tree...');

    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 14,
        maxBufferSize: 64,
        treeCreator: umi.payer,
        public: true
    });

    await builder.sendAndConfirm(umi);

    console.log(
        'Merkle tree created:\n', merkleTree.publicKey.toString()
    );
})();