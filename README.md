

**Clash of Lens** – A SocialFi Clan War Game Built on Lens Protocol

---

### **Description:**

**Clash of Lens** transforms the Lens Protocol into a real-time battleground where Lens Groups (Clans) compete for social dominance and onchain rewards.

Players join or create clans and declare war against rival groups. Battles are decided not by speculation or luck, but by **real onchain social activity** — including GHO tipping, NFT collects, follower growth, and post creation.

Each war lasts for a defined period (e.g., 7 days), during which every qualifying interaction is tracked via a custom **subgraph**. Our smart contract stores pre- and post-war snapshots, resolves outcomes using PostActions like `startWar()` and `declareWinner()`, and automatically distributes rewards.

Winning clans receive GHO bonus pools, **Victory Emblem NFTs**, and **Graph Aura Badges** across their posts. The MVP earns a **Gold Medal NFT** minted onchain.

Built natively on the Lens ecosystem, Clash of Lens is a modular, extensible SocialFi experience that incentivizes engagement, content creation, and community coordination — while making it fun, gamified, and rewarding.

---

### **Built With:**

* **Lens Protocol** – Groups, Profiles, PostActions
* **Solidity** – Custom Clan & War smart contracts
* **The Graph** – Real-time war metric aggregation
* **Next.js** + **Tailwind** – Frontend DApp
* **GHO (Aave stablecoin)** – In-game tipping + war stakes
* **NFT.Storage** – Metadata for badges and rewards
* **RainbowKit / wagmi** – Wallet integration with Lens support

---

### **What Makes It Special:**

* First-ever **PvP clan war game** using Lens Groups as players
* Unique use of **PostActions** to declare and resolve battles
* Real-time war score tracking via onchain activity
* Builds habit loops for **organic engagement**, not farming
* Ready to expand into Seasons, Frames, and other ecosystems
