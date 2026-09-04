# Hyperledger Fabric Blockchain Service

This directory is reserved for the Hyperledger Fabric chaincode and network configuration.
As per the Secura architecture, the blockchain is used to ensure a tamper-proof chain of custody for all digital evidence.

## Future Implementation Details
1. **Chaincode (Smart Contracts):** Will be written in Go or Node.js.
2. **Ledger:** Will store the `SHA-256` hash of every uploaded document along with metadata (uploader ID, timestamp, department).
3. **Integration:** The Django backend will communicate with the Fabric network via the Fabric Gateway SDK to record transactions (uploads, transfers, access logs).
