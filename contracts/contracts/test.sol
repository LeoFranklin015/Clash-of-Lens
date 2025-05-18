// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

  

interface IPostAction {
      struct KeyValue {
    bytes32 key;
    bytes value;
}

    function configure(address originalMsgSender, address feed, uint256 postId, KeyValue[] calldata params)
        external
        returns (bytes memory);

    function execute(address originalMsgSender, address feed, uint256 postId, KeyValue[] calldata params)
        external
        returns (bytes memory);

    function setDisabled(
        address originalMsgSender,
        address feed,
        uint256 postId,
        bool isDisabled,
        KeyValue[] calldata params
    ) external returns (bytes memory);
}

contract Test is IPostAction {
    struct WarLog {
        uint256 warId;
        uint16 outcome;
    }

    WarLog[] public logs;

    event WarLogged(uint256 warId, uint16 outcome, address user);

     function configure(address originalMsgSender, address feed, uint256 postId, KeyValue[] calldata params)
        external
        returns (bytes memory){

        }



    function execute(
        address originalMsgSender,
        address feed,
        uint256 postId,
        KeyValue[] calldata params
    ) external override returns (bytes memory) {
        uint256 warId;
        uint16 outcome;
        bool foundWarId = false;
        bool foundOutcome = false;

        for (uint256 i = 0; i < params.length; i++) {
            if (params[i].key == keccak256("lens.param.warId")) {
                warId = abi.decode(params[i].value, (uint256));
                foundWarId = true;
            } else if (params[i].key == keccak256("lens.param.outcome")) {
                outcome = abi.decode(params[i].value, (uint16));
                foundOutcome = true;
            }
        }

        require(foundWarId && foundOutcome, "Missing warId or outcome");

        logs.push(WarLog({
            warId: warId,
            outcome: outcome
        }));

        emit WarLogged(warId, outcome, originalMsgSender);
        return abi.encode(warId, outcome);
    }

    function setDisabled(
        address originalMsgSender,
        address feed,
        uint256 postId,
        bool isDisabled,
        KeyValue[] calldata params
    ) external returns (bytes memory){
        
    }


    function getAllLogs() external view returns (WarLog[] memory) {
        return logs;
    }
}



