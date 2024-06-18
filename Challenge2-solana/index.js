// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const transferSol = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new keypair for the sender
    const senderKeypair = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const receiverKeypair = Keypair.generate();

    // Airdrop 2 SOL to Sender wallet
    console.log("Airdropping some SOL to Sender wallet!");
    const senderAirDropSignature = await connection.requestAirdrop(
        senderKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
    );

    // Confirm the transaction
    await connection.confirmTransaction(senderAirDropSignature, "confirmed");

    console.log("Airdrop completed for the Sender account");

    // Get sender's wallet balance
    const senderBalance = await connection.getBalance(senderKeypair.publicKey);
    console.log(`Sender's wallet balance: ${senderBalance / LAMPORTS_PER_SOL} SOL`);

    // Calculate amount to transfer (50% of sender's balance)
    const amountToSend = senderBalance / 2;

    // Build transaction to transfer funds
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: receiverKeypair.publicKey,
            lamports: Math.floor(amountToSend) // Amount in lamports (no conversion needed)
        })
    );

    // Sign transaction
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
    );

    console.log(`Successfully transferred ${amountToSend / LAMPORTS_PER_SOL} SOL to Receiver account`);
    console.log('Transaction signature:', signature);
}

transferSol();
