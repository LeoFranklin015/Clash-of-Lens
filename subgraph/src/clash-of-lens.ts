import { BigInt, log } from "@graphprotocol/graph-ts";

import {
  ClanReady as ClanReadyEvent,
  ClanRegistered as ClanRegistered,
  WarDeclared as WarDeclared,
  WarResult as WarResult,
  WarBetted as WarBet,
  ClanBalanceUpdated as ClanBalanceUpdated,
} from "../generated/ClashOfLens/ClashOfLens";

import { Clan, War, Bet } from "../generated/schema";

export function handleClanRegistered(event: ClanRegistered): void {
  let id = event.params.clanAddress.toHex();
  let clan = new Clan(id);

  clan.owner = event.params.owner;
  clan.status = 2;
  clan.balance = BigInt.zero();
  clan.wins = 0;
  clan.wars = 0;

  clan.save();
}

export function handleClanReady(event: ClanReadyEvent): void {
  let id = event.params.clanAddress.toHex();
  let clan = Clan.load(id);
  if (clan == null) {
    log.warning("ClanReady event for unknown clan: {}", [id]);
    return;
  }

  clan.status = 0;
  clan.balance = clan.balance.minus(event.params.stake);
  clan.save();
}

export function handleClanBalanceUpdated(event: ClanBalanceUpdated): void {
  let id = event.params.clan.toHex();
  let clan = Clan.load(id);
  if (clan == null) {
    log.warning("ClanBalanceUpdated for unknown clan: {}", [id]);
    return;
  }

  clan.balance = event.params.balance;
  clan.save();
}

export function handleWarDeclared(event: WarDeclared): void {
  let warId = event.params.warId.toString();
  let war = new War(warId);

  war.clan1 = event.params.clan1.toHex();
  war.clan2 = event.params.clan2.toHex();
  war.timestamp = event.block.timestamp;
  war.result = 0;

  war.save();

  let clan1 = Clan.load(war.clan1);
  if (clan1 != null) {
    clan1.status = 1;
    clan1.wars = clan1.wars + 1;
    clan1.save();
  }

  let clan2 = Clan.load(war.clan2);
  if (clan2 != null) {
    clan2.status = 1;
    clan2.wars = clan2.wars + 1;
    clan2.save();
  }
}

export function handleWarResult(event: WarResult): void {
  let warId = event.params.warId.toString();
  let war = War.load(warId);
  if (war == null) {
    log.warning("WarResult for unknown war: {}", [warId]);
    return;
  }

  war.result = event.params.result;
  war.save();

  let clan1 = Clan.load(war.clan1);
  if (clan1 != null) {
    clan1.status = 2;
    if (event.params.result == 1) {
      clan1.wins = clan1.wins + 1;
    }
    clan1.save();
  }

  let clan2 = Clan.load(war.clan2);
  if (clan2 != null) {
    clan2.status = 2;
    if (event.params.result == 2) {
      clan2.wins = clan2.wins + 1;
    }
    clan2.save();
  }
}

export function handleWarBetted(event: WarBet): void {
  let betId =
    event.transaction.hash.toHex() + "-" + event.params.bettor.toString();
  let bet = new Bet(betId);

  bet.war = event.params.warId.toString();
  bet.bettor = event.params.bettor;
  bet.outcome = event.params.outcome;
  bet.claimed = false;

  bet.save();
}
