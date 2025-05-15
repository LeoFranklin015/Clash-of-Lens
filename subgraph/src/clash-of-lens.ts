import {
  ClanReady as ClanReadyEvent,
  ClanRegistered as ClanRegisteredEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  WarDeclared as WarDeclaredEvent,
  WarResult as WarResultEvent
} from "../generated/ClashOfLens/ClashOfLens"
import {
  ClanReady,
  ClanRegistered,
  OwnershipTransferred,
  WarDeclared,
  WarResult
} from "../generated/schema"

export function handleClanReady(event: ClanReadyEvent): void {
  let entity = new ClanReady(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.clanAddress = event.params.clanAddress
  entity.stake = event.params.stake

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClanRegistered(event: ClanRegisteredEvent): void {
  let entity = new ClanRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.clanAddress = event.params.clanAddress
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWarDeclared(event: WarDeclaredEvent): void {
  let entity = new WarDeclared(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.warId = event.params.warId
  entity.clan1 = event.params.clan1
  entity.clan2 = event.params.clan2

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWarResult(event: WarResultEvent): void {
  let entity = new WarResult(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.warId = event.params.warId
  entity.result = event.params.result

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
