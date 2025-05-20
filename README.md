# ⚔️ Clash of Lens

**A SocialFi Clan War Game Built on Lens Protocol**

Clash of Lens transforms the Lens Protocol into a real-time battleground where **Lens Groups become Clans**, and **onchain social activity becomes strategy**. It’s the first-ever PvP game on Lens where tipping, followers, posts, and NFT collects determine victory — not chance.


![image](https://github.com/user-attachments/assets/f87d6de0-34c7-4cdc-99cf-66a6936c7bbd)

---

## 🚀 Live Demo

[➡️ View the App](https://clashoflens.xyz)  
[📺 Watch Demo Video](#) (https://youtu.be/5zoGXNTbTg4)

---

## 🧠 How It Works

1. **Create or Join a Clan**  
   Clans are Lens Groups. Users form teams and represent their collective identity.

2. **Declare War**  
   Clan leaders trigger a `startWar()` PostAction. Wars run for a fixed time (e.g., 7 days).

3. **Compete in Real Metrics**  
   All war activity is tracked via a custom subgraph:
   - 💰 GHO tips
   - 🖼 NFT collects
   - 👥 Follower growth
   - 📝 Post activity

4. **Predictions Markets are posted**
 Fans can engage with the market and bet on their fav clan. ( Custom Post Action ) 

5. **Declare the Winner**  
   At the end of the war, `declareWinner()` is called via PostAction. Metrics are resolved, and rewards are distributed onchain.

6. **Earn Rewards**  
   - 🏆 Winning Clan: GHO Pool, Victory Emblem NFTs  
   - ✨ MVP Player: Gold Medal NFT  
   - 🌈 Members: Graph Aura profile badge

---

## 🛠 Built With

| Stack               | Purpose                                  |
|---------------------|-------------------------------------------|
| **Lens Protocol**   | Groups (Clans), Profiles, PostActions     |
| **Solidity**        | Clan & War contracts + reward logic       |
| **The Graph**       | Subgraph for metric tracking during wars  |
| **Next.js + Tailwind** | Frontend DApp UI                        |
| **GHO**             | Tipping + War stake currency              |
| **NFT.Storage**     | Storing war badges and metadata           |
| **FamilyConnect / wagmi** | Wallet + Lens Profile connection      |
| **Alchemy**            | RPC URLS                              | 

---

## 🎮 Features

- 🛡 **Clan-Based PvP Wars** using real Lens activity  
- ⚔️ **PostActions** to start wars and declare winners  
- 📈 **Subgraph-powered scoreboards**  
- 🧑‍🤝‍🧑 **Community-first gameplay** – no bots or speculation  
- 🪙 **Earn GHO + NFTs** through organic engagement  
- 🧩 **Modular**: Easily extend to Seasons, Quests, Frames, and more

---
