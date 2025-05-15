## ClashOfLens Dapp User Flow & Contract Integration

### 1. **Register a Clan**
- **UI Step:** User clicks “Register Clan”.
- **Contract Call:** `registerClan()`
- **Sample Code:**
  ```js
  await contract.registerClan();
  ```
- **Notes:** Only one clan per address. Show success or error.

---

### 2. **Deposit Balance (Optional)**
- **UI Step:** User can deposit extra funds to their clan.
- **Contract Call:** `depositBalance(clanAddress)` (payable)
- **Sample Code:**
  ```js
  await contract.depositBalance(userAddress, { value: ethers.parseEther("0.5") });
  ```
- **Notes:** This is optional and separate from the “ready” stake.

---

### 3. **Set Clan Ready (Stake)**
- **UI Step:** User enters a stake amount and clicks “Set Ready”.
- **Contract Call:** `setReady()` (payable)
- **Sample Code:**
  ```js
  await contract.setReady({ value: ethers.parseEther("1") });
  ```
- **Notes:** Clan status changes to “ready”. Only the clan owner can call this.

---

### 4. **Wage War**
- **UI Step:** User selects an opponent from the list of “ready” clans and clicks “Wage War”.
- **Contract Call:** `wageWar(opponentAddress)` (payable, must match your stake)
- **Sample Code:**
  ```js
  await contract.wageWar(opponentAddress, { value: ethers.parseEther("1") });
  ```
- **Notes:** Both clans must be “ready” and have the same stake. War is created and both clans’ statuses become “at war”.

---

### 5. **Spectator Bets**
- **UI Step:** Any user can bet on an unresolved war by selecting a war and outcome (clan1 or clan2).
- **Contract Call:** `betOnWar(warId, outcome)` (payable)
- **Sample Code:**
  ```js
  await contract.betOnWar(1, 1, { value: ethers.parseEther("0.2") }); // 1 = clan1 wins, 2 = clan2 wins
  ```
- **Notes:** Bets are recorded. (Payout logic is not implemented yet.)

---

### 6. **Declare Victory (Admin/Owner Only)**
- **UI Step:** Admin selects a war and declares the winner.
- **Contract Call:** `declareVictory(warId, result)`
- **Sample Code:**
  ```js
  await contract.declareVictory(1, 1); // 1 = clan1 wins, 2 = clan2 wins
  ```
- **Notes:** Only the contract owner can call this. War is resolved, and both clans’ statuses reset.

---

### 7. **Claim Win**
- **UI Step:** Winning clan owner clicks “Claim Prize” for a resolved war.
- **Contract Call:** `claimWin(warId)`
- **Sample Code:**
  ```js
  await contract.claimWin(1);
  ```
- **Notes:** Only the winning clan owner can call this. Both stakes are transferred to the winner.

---

## **Sample Data for UI**
- **Clans:**  
  - `clans(uint)` returns a Clan struct: `{ clanAddress, owner, status }`
  - `clanIndex(address)` returns index+1 if registered, 0 otherwise
  - `clanBalances(address)` returns balance in wei

- **Wars:**  
  - `wars(uint)` returns a War struct: `{ id, clan1, clan2, timestamp, result }`
  - `warCount` returns total number of wars

- **Bets:**  
  - `warBets(uint)` returns a WarBet struct: `{ id, warId, bettor, outcome }`
  - `betCount` returns total number of bets

---

## **Frontend Integration Tips**
- Use `ethers.js` or `viem` to connect to the contract.
- Use `contract.filters` to listen for events: `ClanRegistered`, `ClanReady`, `WarDeclared`, `WarResult`.
- Use `await contract.clans(i)` in a loop to fetch all clans, and similarly for wars and bets.
- Use `status` fields to filter clans:  
  - `0 = ready`, `1 = at war`, `2 = not-ready`
- Use `result` in wars:  
  - `0 = unresolved`, `1 = clan1 wins`, `2 = clan2 wins`
- Show error messages from failed transactions for better UX.

---

## **Example: Fetching All Ready Clans**
```js
const readyClans = [];
const clanCount = await contract.clans.length;
for (let i = 0; i < clanCount; i++) {
  const clan = await contract.clans(i);
  if (clan.status === 0) readyClans.push(clan);
}
```