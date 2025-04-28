const { Connection, clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');
const fs = require('fs');

async function addMetadata() {
    try {
        // Load keypair from file
        const keypairFile = JSON.parse(fs.readFileSync('/Users/oghenekparobor/.config/solana/id.json', 'utf8'));
        const keypair = Keypair.fromSecretKey(new Uint8Array(keypairFile));

        // Connect to network
        const connection = new Connection(clusterApiUrl('devnet'));
        
        // Create Metaplex instance with keypair identity
        const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));

        // Your token mint address - REPLACE THIS WITH YOUR ACTUAL TOKEN MINT ADDRESS
        const mintAddress = new PublicKey('HGeLyusZNbG6bZ1RBi3W9fKV6gjZv6soVxoXBbSeuHSk');

        console.log('Creating metadata for token:', mintAddress.toString());
        console.log('Using wallet:', keypair.publicKey.toString());

        console.log('Creating metadata for token:', mintAddress.toString());
        console.log('Using wallet:', keypair.publicKey.toString());

        // Create metadata
        const { nft } = await metaplex.nfts().create({
            uri: 'https://raw.githubusercontent.com/Guava-Finance/Guava_USDC/main/assets/metadata.json',
            name: 'Guava USDC',
            symbol: 'gUSDC',
            sellerFeeBasisPoints: 0, // No royalties
            useNewMint: false, // Use existing mint
            mintAddress: mintAddress,
        });

        console.log('Metadata added successfully!');
        console.log('NFT/Token address:', nft.address.toString());
        console.log('Metadata address:', nft.metadataAddress.toString());
    } catch (error) {
        console.error('Error adding metadata:', error);
        // More detailed error debugging
        if (error.logs) {
            console.error('Transaction logs:', error.logs);
        }
    }
}

addMetadata();