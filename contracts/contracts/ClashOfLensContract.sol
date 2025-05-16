// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ClashOfLensContract is Ownable {
    // —— EVENTS
    event ClanRegistered(address indexed clanAddress, address indexed owner);
    event ClanReady(address indexed clanAddress, uint256 stake);
    event WarDeclared(
        uint256 indexed warId,
        address indexed clan1,
        address indexed clan2
    );
    event WarResult(uint256 indexed warId, uint16 result);
    event WarBetted(
        uint256 indexed warId,
        uint16 outcome,
        address indexed bettor
    );
    event ClanBalanceUpdated(address indexed clan, uint256 balance);

    // —— STRUCTS
    struct Clan {
        address clanAddress; // usually same as owner
        address owner;
        uint16 status; // 0 = ready, 1 = at war, 2 = not-ready
    }

    struct War {
        uint256 id;
        address clan1;
        address clan2;
        uint256 timestamp;
        uint16 result; // 0 = unresolved, 1 = clan1 wins, 2 = clan2 wins
    }

    struct WarBet {
        uint256 id;
        uint256 warId;
        address bettor;
        uint16 outcome; // 1 = clan1-win, 2 = clan2-win
    }

    // —— STATE
    mapping(address => Clan) public clans; // maps clanAddress → Clan
    War[] public wars;
    WarBet[] public warBets;

    mapping(address => uint256) public clanBalances; // maps clanAddress → balance
    uint256 public warCount;
    uint256 public betCount;

    // —— MODIFIERS
    modifier onlyClanOwner(address _clan) {
        require(clans[_clan].owner != address(0), "Clan not registered");
        require(msg.sender == clans[_clan].owner, "Not clan owner");
        _;
    }

    modifier onlyWarWinner(uint256 _warId) {
        require(_warId > 0 && _warId <= warCount, "Invalid war");
        War storage w = wars[_warId - 1];
        require(w.result == 1 || w.result == 2, "War not resolved");
        address winner = w.result == 1 ? w.clan1 : w.clan2;
        require(msg.sender == winner, "Not war winner");
        _;
    }

    // —— CORE FUNCTIONS

    /// @notice Register yourself as a new clan
    function registerClan(address _clan) external {
        require(clans[_clan].owner == address(0), "Already registered");
        clans[_clan] = Clan({
            clanAddress: _clan,
            owner: msg.sender,
            status: 2 // not-ready
        });
        emit ClanRegistered(_clan, msg.sender);
    }

    /// @notice Deposit funds to increase clan balance
    function depositBalance(address _clan) external payable {
        require(msg.value > 0, "Must deposit more than 0");
        clanBalances[_clan] += msg.value;
        emit ClanBalanceUpdated(_clan, clanBalances[_clan]);
    }

    /// @notice Deposit stake and mark clan as ready
    function setReady(address _clan) external onlyClanOwner(_clan) {
        Clan storage clan = clans[_clan];
        require(clan.status == 2, "Already ready or at war");
        require (clanBalances[_clan] >= 10000000000000000 , "Not Enough to stake for war");

        clan.status = 0; // ready
        clanBalances[_clan] -= 10000000000000000;
        emit ClanReady(_clan,10000000000000000);
    }

    /// @notice Challenge another ready clan to war (must match your stake)
    function wageWar(
        address _clan,
        address _opponent
    ) external onlyClanOwner(_clan) {
        Clan storage me = clans[_clan];
        Clan storage op = clans[_opponent];

        require(op.status == 0, "Opponent clans must be ready");
        require (clanBalances[_clan] >= 10000000000000000 , "Not Enough to stake for war");
        clanBalances[_clan] -= 10000000000000000;

        // Update statuses
        me.status = 1;
        op.status = 1;

        // Record war
        warCount += 1;
        wars.push(
            War({
                id: warCount,
                clan1: me.clanAddress,
                clan2: op.clanAddress,
                timestamp: block.timestamp,
                result: 0
            })
        );
        emit WarDeclared(warCount, me.clanAddress, op.clanAddress);
    }

    /// @notice Owner (referee) declares the war outcome
    function declareVictory(uint256 _warId, uint16 _result) external onlyOwner {
        require(_warId > 0 && _warId <= warCount, "Invalid warId");
        require(_result == 1 || _result == 2, "Result must be 1 or 2");

        War storage w = wars[_warId - 1];
        require(w.result == 0, "Already declared");
        w.result = _result;

        // reset clan statuses
        _resetClan(w.clan1);
        _resetClan(w.clan2);

        emit WarResult(_warId, _result);
    }

    /// @notice Spectators bet on the outcome
    function betOnWar(uint256 _warId, uint16 _outcome) external payable {
        require(_warId > 0 && _warId <= warCount, "Invalid warId");
        require(wars[_warId - 1].result == 0, "War already resolved");
        require(_outcome == 1 || _outcome == 2, "Outcome must be 1 or 2");
        require(msg.value > 0, "Stake required");

        betCount += 1;
        warBets.push(
            WarBet({
                id: betCount,
                warId: _warId,
                bettor: msg.sender,
                outcome: _outcome
            })
        );

        emit WarBetted(_warId, _outcome, msg.sender);
        // (payout logic for bettors can be added in a future version)
    }

    /// @notice Winning clan owner claims both stakes
    function claimWin(uint256 _warId) external onlyWarWinner(_warId) {
        War storage w = wars[_warId - 1];
        address c1 = w.clan1;
        address c2 = w.clan2;

        uint256 prize = clanBalances[c1] + clanBalances[c2];

        // zero out balances
        clanBalances[c1] = 0;
        clanBalances[c2] = 0;

        // Transfer prize
        (bool ok, ) = msg.sender.call{value: prize}("");
        require(ok, "Transfer failed");
    }

    // —— INTERNAL HELPERS
    function _resetClan(address _c) internal {
        clans[_c].status = 2; // back to not-ready
        // balance is held until claimed
    }

    constructor(address initialOwner) Ownable(initialOwner) {}
}
