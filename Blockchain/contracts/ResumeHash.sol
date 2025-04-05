// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ResumeHash {
    // Mapping resume id to its SHA-256 hash
    mapping(string => string) public resumeHashes;

    event ResumeHashRecorded(string indexed resumeId, string hashValue);

    function recordHash(string memory resumeId, string memory hashValue) public {
        resumeHashes[resumeId] = hashValue;
        emit ResumeHashRecorded(resumeId, hashValue);
    }

    function getHash(string memory resumeId) public view returns (string memory) {
        return resumeHashes[resumeId];
    }
}
