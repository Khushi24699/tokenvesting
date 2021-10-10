// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./token.sol";


contract TokenVesting is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for ERC20;
  
  using SafeERC20 for TToken;
  
  event Released(address beneficiary,uint256 amount);
  event Revoked();

  
  //address public beneficiary;

//   uint256 public cliff;
  uint256 public start;
  uint256 public duration;
  IERC20 public _token;
  bool public revocable;

  mapping (address => uint256) public released;
  mapping (address => bool) public revoked;
  mapping (address => uint256) public shares;
  address[] public beneficiaries;
  
   modifier onlyBeneficiaries {
    require(msg.sender == owner || shares[msg.sender] > 0, "You cannot release tokens!");
    _;
  }
  
  constructor(address _token, uint256 _start,  uint256 _duration, bool _revocable)  {
    // require(_beneficiary != address(0));
    // require(_cliff <= _duration);

    // beneficiary = _beneficiary;
    token=_token;
    revocable = _revocable;
    duration = _duration;
    // cliff = _start.add(_cliff);
    start = _start;
  }

  function addBeneficiary(address _beneficiary, uint256 _sharesAmount) onlyOwner public {
    require(_beneficiary != address(0), "The beneficiary's address cannot be 0");
    require(_sharesAmount > 0, "Shares amount has to be greater than 0");
     releaseAllTokens();

    if (shares[_beneficiary] == 0) {
      beneficiaries.push(_beneficiary);
    }

    shares[_beneficiary] = shares[_beneficiary].add(_sharesAmount);
  }

  
  function releaseAllTokens() onlyBeneficiaries public {
    uint256 unreleased = releasableAmount();

    if (unreleased > 0) {
      uint beneficiariesCount = beneficiaries.length;

      released = released.add(unreleased);

      for (uint i = 0; i < beneficiariesCount; i++) {
        release(beneficiaries[i], calculateShares(unreleased, beneficiaries[i]));
      }
    }
  }

  function releasableAmount() public view returns (uint256) {
    return vestedAmount().sub(released);
  }

  function calculateShares(uint256 _amount, address _beneficiary) public view returns (uint256) {
    return _amount.mul(shares[_beneficiary]).div(totalShares());
  }

  function totalShares() public view returns (uint256) {
    uint sum = 0;
    uint beneficiariesCount = beneficiaries.length;

    for (uint i = 0; i < beneficiariesCount; i++) {
      sum = sum.add(shares[beneficiaries[i]]);
    }

    return sum;
  }

 function release(address _beneficiary, uint256 _amount) private {
    token.safeTransfer(_beneficiary, _amount);
    emit Released(_beneficiary, _amount);
  }
}
 
  // function revoke(ERC20 token) public onlyOwner {
  //   require(revocable);
  //   require(!revoked[address(token)]);

  //   uint256 balance = token.balanceOf(address(this));

  //   uint256 unreleased = releasableAmount(token);
  //   uint256 refund = balance.sub(unreleased);

  //   revoked[address(token)] = true;

  //   token.safeTransfer(owner(), refund);

  //   emit Revoked();
  // }


   
  function releasableAmount(ERC20 token) public view returns (uint256) {
    return vestedAmount(token).sub(released[address(token)]);
  }
  
  // function vestedAmount(ERC20 token) public view returns (uint256) {
  //   uint256 currentBalance = token.balanceOf(address(this));
  //   uint256 totalBalance = currentBalance.add(released[address(token)]);

  //   // if (block.timestamp < cliff) {
  //   //   return 0;
  //   // } else if (block.timestamp >= start.add(duration) || revoked[address(token)]) {
  //   //   return totalBalance;
  //   // } else {
  //   //   return totalBalance.mul(block.timestamp.sub(start)).div(duration);
  //   // }
  // } 
}