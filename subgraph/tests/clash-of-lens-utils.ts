import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ClanReady,
  ClanRegistered,
  OwnershipTransferred,
  WarDeclared,
  WarResult
} from "../generated/ClashOfLens/ClashOfLens"

export function createClanReadyEvent(
  clanAddress: Address,
  stake: BigInt
): ClanReady {
  let clanReadyEvent = changetype<ClanReady>(newMockEvent())

  clanReadyEvent.parameters = new Array()

  clanReadyEvent.parameters.push(
    new ethereum.EventParam(
      "clanAddress",
      ethereum.Value.fromAddress(clanAddress)
    )
  )
  clanReadyEvent.parameters.push(
    new ethereum.EventParam("stake", ethereum.Value.fromUnsignedBigInt(stake))
  )

  return clanReadyEvent
}

export function createClanRegisteredEvent(
  clanAddress: Address,
  owner: Address
): ClanRegistered {
  let clanRegisteredEvent = changetype<ClanRegistered>(newMockEvent())

  clanRegisteredEvent.parameters = new Array()

  clanRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "clanAddress",
      ethereum.Value.fromAddress(clanAddress)
    )
  )
  clanRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return clanRegisteredEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createWarDeclaredEvent(
  warId: BigInt,
  clan1: Address,
  clan2: Address
): WarDeclared {
  let warDeclaredEvent = changetype<WarDeclared>(newMockEvent())

  warDeclaredEvent.parameters = new Array()

  warDeclaredEvent.parameters.push(
    new ethereum.EventParam("warId", ethereum.Value.fromUnsignedBigInt(warId))
  )
  warDeclaredEvent.parameters.push(
    new ethereum.EventParam("clan1", ethereum.Value.fromAddress(clan1))
  )
  warDeclaredEvent.parameters.push(
    new ethereum.EventParam("clan2", ethereum.Value.fromAddress(clan2))
  )

  return warDeclaredEvent
}

export function createWarResultEvent(warId: BigInt, result: i32): WarResult {
  let warResultEvent = changetype<WarResult>(newMockEvent())

  warResultEvent.parameters = new Array()

  warResultEvent.parameters.push(
    new ethereum.EventParam("warId", ethereum.Value.fromUnsignedBigInt(warId))
  )
  warResultEvent.parameters.push(
    new ethereum.EventParam(
      "result",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(result))
    )
  )

  return warResultEvent
}
