```mermaid
sequenceDiagram
    actor User
    participant Metamask
    participant Dapp
    participant Snap
    participant Kms

    User->>Dapp: Select "Import Account"
    Dapp->>Snap: Request account import
    Snap->>Metamask: Notify account import
    User->>Metamask: Approve account import
    Metamask-->>Snap: OK
    Snap->>Kms: Get public key
    Kms-->>Snap: Public key
    Snap->>Snap: Convert public key to ETH format
    Snap-->>Dapp: Account imported
    Dapp-->>User: Account import complete

```