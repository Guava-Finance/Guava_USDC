const { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { createCreateMetadataAccountV3Instruction } = require('@metaplex-foundation/mpl-token-metadata');
const fs = require('fs');

async function addMetadata() {
    // Load keypair from file
    const keypairFile = JSON.parse(fs.readFileSync('/Users/oghenekparobor/.config/solana/id.json', 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairFile));

    // Connect to network
    const connection = new Connection(clusterApiUrl('devnet'));

    // Your token mint address
    const mintAddress = new PublicKey('YOUR_TOKEN_MINT_ADDRESS');

    // Derive metadata PDA
    const metadataProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            metadataProgramId.toBuffer(),
            mintAddress.toBuffer(),
        ],
        metadataProgramId
    );

    // Create metadata
    const metadataInstruction = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataAccount,
            mint: mintAddress,
            mintAuthority: keypair.publicKey,
            payer: keypair.publicKey,
            updateAuthority: keypair.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                data: {
                    name: 'Guava USDC',
                    symbol: 'gUSDC',
                    uri: 'https://github.com/Guava-Finance/Guava_USDC/blob/main/assets/metadata.json',
                    sellerFeeBasisPoints: 0,
                    creators: null,
                    collection: null,
                    uses: null,
                },
                isMutable: true,
                collectionDetails: null
            }
        }
    );

    const transaction = new Transaction().add(metadataInstruction);

    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [keypair]
        );
        console.log('Metadata added successfully!');
        console.log('Transaction signature:', signature);
    } catch (error) {
        console.error('Error adding metadata:', error);
    }
}

addMetadata();