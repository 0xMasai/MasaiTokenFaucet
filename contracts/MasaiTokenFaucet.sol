// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MasaiTokenFaucet is ERC20, Ownable {
    uint256 public faucetAmount;

    constructor() ERC20("MasaiToken", "MASAI") Ownable(msg.sender) {
        faucetAmount = 100 * 10 ** decimals();
        _mint(address(this), 1_000_000 * 10 ** decimals()); // Mint 1M tokens to faucet
    }

    function claimTokens() external {
        require(balanceOf(address(this)) >= faucetAmount, "Not enough tokens in faucet");
        _transfer(address(this), msg.sender, faucetAmount);
    }

    function setFaucetAmount(uint256 _amount) external onlyOwner {
        faucetAmount = _amount;
    }

    function refillFaucet(uint256 amount) external onlyOwner {
        _mint(address(this), amount);
    }
}
