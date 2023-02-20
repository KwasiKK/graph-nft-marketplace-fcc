import { Address } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import {
    ItemBought as ItemBoughtEvent,
    ItemDelisted as ItemDelistedEvent,
    ItemListed as ItemListedEvent,
    ItemUpdated as ItemUpdatedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemDelisted, ItemListed, ItemUpdated, ActiveItem } from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
    let entity = ItemBought.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
    if (!entity) {
        entity = new ItemBought(event.transaction.hash.concatI32(event.logIndex.toI32())) //getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    }

    entity.buyer = event.params.buyer
    entity.nftAddress = event.params.nftAddress
    entity.tokenId = event.params.tokenId
    entity.price = event.params.price

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()

    let activeItem = ActiveItem.load(
        event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
    )
    // if (!activeItem) {
    //     activeItem = new ActiveItem(
    //         event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
    //     )
    // }

    activeItem!.buyer = event.params.buyer
    activeItem!.save()
}

export function handleItemDelisted(event: ItemDelistedEvent): void {
    let entity = ItemDelisted.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
    if (!entity) {
        entity = new ItemDelisted(event.transaction.hash.concatI32(event.logIndex.toI32()))
    }
    entity.seller = event.params.seller
    entity.nftAddress = event.params.nftAddress
    entity.tokenId = event.params.tokenId

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    let activeItem = ActiveItem.load(
        event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
    )

    activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")
    entity.save()
    activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
    let entity = ItemListed.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
    let activeItem = ActiveItem.load(
        event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
    )
    if (!entity) {
        entity = new ItemListed(event.transaction.hash.concatI32(event.logIndex.toI32()))
    }
    if (!activeItem) {
        activeItem = new ActiveItem(
            event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
        )
    }

    entity.seller = event.params.seller
    entity.nftAddress = event.params.nftAddress
    entity.tokenId = event.params.tokenId
    entity.price = event.params.price

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    activeItem.seller = event.params.seller
    activeItem.nftAddress = event.params.nftAddress
    activeItem.tokenId = event.params.tokenId
    activeItem.price = event.params.price
    activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

    entity.save()
    activeItem.save()
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
    let entity = new ItemUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()))
    let activeItem = ActiveItem.load(
        event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
    )
    if (!activeItem) {
        activeItem = new ActiveItem(
            event.transaction.hash.concatI32(event.logIndex.toI32()).toString()
        )
    }
    entity.seller = event.params.seller
    entity.nftAddress = event.params.nftAddress
    entity.tokenId = event.params.tokenId
    entity.price = event.params.price

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    activeItem.seller = event.params.seller
    activeItem.nftAddress = event.params.nftAddress
    activeItem.tokenId = event.params.tokenId
    activeItem.price = event.params.price

    entity.save()
    activeItem.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
    return tokenId.toHexString() + nftAddress.toHexString()
}
