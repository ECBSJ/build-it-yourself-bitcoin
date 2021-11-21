# build-it-yourself-bitcoin
 https://build-it-yourself-bitcoin.herokuapp.com/

<h1>About</h1>

This tool serves as an educational tool for users and newcomers to understand some of the mechanics behind a bitcoin transaction. These days, bitcoin transactions are sent via a simple click of a 'send' button in a wallet software app. This layer of convenience is necessary for mass adoption of bitcoin. But as the bitcoin industry and movement has warped easy-to-use, consumer grade applications, the convenience has inadvertently skewed us away from learning about the tech beneath it all. Bitcoin was created to place financial sovereignty back in the hands of the people. Ideally, using bitcoin should encompass one to run their own node, create their own wallet, self-custody their own private keys, and to build their own transaction. To "build" one's own transaction can go a layer down from merely clicking a "send" button. Most of the time basic coding and certain library packages could accommodate this. This tool, which can be deemed still in beta mode, has made this "building" of a transaction in an educational and user-friendly way.

<h2>How to use</h2>

*If you are viewing the application on the small screen, it is suggested to zoom out in the browser for better viewing experience. This responsive design is part of the future improvement considerations listed below.

The application guides a user through some simple steps on building and broadcasting out a transaction. 

It's meant to be educational, informative, simple, and fun. 

Some notes to point out before starting:

1.Proper security audit has not been ran on this application, therefore it is highly advised you use a private/public key pair that you do not intend to use in the future.

2.Due to the above's recommendation for a private/public key one-time-use, this application will only accept 1 TXIN and 1 TXOUT output transaction. In other words, 1 UTXO in and 1 UTXO out. Use a bitcoin address that already only contains 1 UTXO. No change address option is provided. 

3.This will only support P2PKH and P2WPKH transactions. 

4.If you would like to create some private/public key pairs to use during the process, you can create your own at www.rawbitcoinkeys.com (this is another educational that teaches how a basic legacy (P2PKH) bitcoin address is made from a private key. 

If you would like to improve this tool, feel free to add a pull request to the repository.

<h2>Steps the application will guide you through</h2>

Step 1: This tutorial starts out with inputting an existing bitcoin address into the field on the right.

Step 2: Retrieving UTXOs. If the current balance is not zero, there are available UTXOs pertaining to your address.

Step 3: Starting Transaction Builder. With your UTXOs displaying, you can now start to build your transaction by inputting TXIn details.

Step 4: Enter receiving address. A ScriptPubKey lock needs to be formed from the hash160 of the receiving address.

Step 5: Build ScriptPubKey. Now with the hash160 of the receiving address revealed, package the necessary Script operators to generate the actual ScriptPubKey.

Step 6: Enter WIF Private Key. Input in your WIF formatted private key to complete the signing of the transaction process.

Step 7: With the Pre-Signed Transaction Hash, you will now need to take your WIF private key to sign the transaction.

Step 8: Finalize the ScriptSig by combining both the signature and public key. 

Step 9: Broadcast given transaction hex.

<h3>Future considerations</h3>

- Adding support for P2SH transactions
- Adding multi-signature transaction support
- Allowing for multiple TXIN and TXOUT capabilities.
- UI/UX improvement. If you are viewing the application on the small screen, it is suggested to zoom out in the browser for better viewing experience.
- Proper codebase audit/review.
- Fixing existing multiple UTXO display UI after querying the UTXOs pertaining to an address.
