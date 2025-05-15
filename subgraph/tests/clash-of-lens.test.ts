import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ClanReady } from "../generated/schema"
import { ClanReady as ClanReadyEvent } from "../generated/ClashOfLens/ClashOfLens"
import { handleClanReady } from "../src/clash-of-lens"
import { createClanReadyEvent } from "./clash-of-lens-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let clanAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let stake = BigInt.fromI32(234)
    let newClanReadyEvent = createClanReadyEvent(clanAddress, stake)
    handleClanReady(newClanReadyEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ClanReady created and stored", () => {
    assert.entityCount("ClanReady", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ClanReady",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "clanAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ClanReady",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "stake",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
