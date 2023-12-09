import "../Styles/connect.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { Ethereum } from "@particle-network/chains";

export const ConnectWallet = () => {

    const [walletAddress, setWalletAddress] = useState("");
    const [signer, setSigner] = useState("");



    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
    }, [walletAddress]);


    // If Metamask is installed on device then this function must be executed!
    // ------------------------------------------------------------------------------------------//
    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                /* MetaMask is installed */
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);

                setSigner(provider.getSigner());

                setWalletAddress(accounts[0]);
                console.log(accounts[0]);
            } catch (err) {
                console.error(err.message);
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
            createSmartWallet();
        }
    };

    const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_accounts", []);

                setSigner(provider.getSigner());

                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    console.log(accounts[0]);
                } else {
                    console.log("Connect to MetaMask using the Connect button");
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
        }
    };

    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0]);
                console.log(accounts[0]);
            });
        } else {
            /* MetaMask is not installed */
            setWalletAddress("");
            console.log("Please install MetaMask");
        }
    };
    // ------------------------------------------------------------------------------------------//


    // Smart Wallet provided if MetaMask is not installed
    const createSmartWallet = async () => {
        const particle = new ParticleNetwork({
            projectId: "3d9b890f-8462-42cb-bc5b-8e500040d4c2",
            clientKey: "cIa6kcT29cOFulrX9UEOJhvxQScSt5HEHtuXtDnQ",
            appId: "5ed47ad0-0413-41cf-a2ce-d8e8c915e73a",
            chainName: "ethereum", //optional: current chain name, default Ethereum.
            chainId: 11155111, //optional: current chain id, default 1.
            wallet: {   //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
                displayWalletEntry: true,  //show wallet entry when connect particle.
                defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
                uiMode: "dark",  //optional: light or dark, if not set, the default is the same as web auth.
                supportChains: [{ id: 1, name: "Ethereum" }, { id: 5, name: "Ethereum" }], // optional: web wallet support chains.
                customStyle: {}, //optional: custom wallet style
            },
            securityAccount: { //optional: particle security account config
                //prompt set payment password. 0: None, 1: Once(default), 2: Always
                promptSettingWhenSign: 1,
                //prompt set master password. 0: None(default), 1: Once, 2: Always
                promptMasterPasswordSettingWhenLogin: 1
            },
        });

        const particleProvider = new ParticleProvider(particle.auth);
        const ethersProvider = new ethers.providers.Web3Provider(particleProvider, "any");
        const ethersSigner = ethersProvider.getSigner();

        if (!particle.auth.isLogin()) {
            // Request user login if needed, returns current user info
            const userInfo = await particle.auth.login();
        }

        const userInfo = await particle.auth.login({
            preferredAuthType: 'phone',
            account: '+14155552671', //phone number must use E.164
        });
    }


    return (
        <div>
            <button className="connect" onClick={connectWallet}> Connect Wallet </button>
        </div>
    )
}