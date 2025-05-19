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