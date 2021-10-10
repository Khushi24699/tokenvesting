import contract from 'truffle-contract'
import Network from "./network"

export async function getTokenVesting(address) {
    const TokenVesting = contract(require('./contracts/TokenVesting.json'))
    const provider = await Network.provider()
    TokenVesting.setProvider(provider)
    return TokenVesting.at(address)
}

export async function getTToken(address) {
    const TToken = contract(require('contracts/token.json'))
    const provider = await Network.provider()
    TToken.setProvider(provider)
    return TToken.at(address)
}