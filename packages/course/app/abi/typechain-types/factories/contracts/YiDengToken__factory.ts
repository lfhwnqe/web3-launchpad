/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  YiDengToken,
  YiDengTokenInterface,
} from "../../contracts/YiDengToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "teamWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "marketingWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "communityWallet",
        type: "address",
      },
    ],
    name: "InitialDistributionCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "TokensSold",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKENS_PER_ETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "communityAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "teamWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "marketingWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "communityWallet",
        type: "address",
      },
    ],
    name: "distributeInitialTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialDistributionDone",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketingAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "remainingMintableSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "sellTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "teamAllocation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50336040518060400160405280600c81526020016b2cb4a232b733902a37b5b2b760a11b81525060405180604001604052806002815260200161165160f21b815250816003908162000064919062000211565b50600462000073828262000211565b5050506001600160a01b038116620000a557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b620000b0816200011a565b506064620000c3621312d06014620002dd565b620000cf919062000309565b6006556064620000e4621312d0600a620002dd565b620000f0919062000309565b600755606462000105621312d0600a620002dd565b62000111919062000309565b6008556200032c565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200019757607f821691505b602082108103620001b857634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200020c57600081815260208120601f850160051c81016020861015620001e75750805b601f850160051c820191505b818110156200020857828155600101620001f3565b5050505b505050565b81516001600160401b038111156200022d576200022d6200016c565b62000245816200023e845462000182565b84620001be565b602080601f8311600181146200027d5760008415620002645750858301515b600019600386901b1c1916600185901b17855562000208565b600085815260208120601f198616915b82811015620002ae578886015182559484019460019091019084016200028d565b5085821015620002cd5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b80820281158282048414176200030357634e487b7160e01b600052601160045260246000fd5b92915050565b6000826200032757634e487b7160e01b600052601260045260246000fd5b500490565b610fce806200033c6000396000f3fe6080604052600436106101385760003560e01c80636c11bcd3116100b0578063bc6e66041161006c578063bc6e660414610339578063d53b4ab41461034f578063dd62ed3e14610365578063e086e5ec146103ab578063e492c5a9146103c0578063f2fde38b146103e057005b80636c11bcd31461027157806370a0823114610291578063715018a6146102c75780638da5cb5b146102dc57806395d89b4114610304578063a9059cbb1461031957005b806318160ddd116100ff57806318160ddd146101de57806323b872dd146101f3578063313ce5671461021357806332cb6b0c1461022f578063349f0b90146102465780636816521a1461025b57005b80630535ec771461014157806306fdde0314610170578063095ea7b314610192578063150d283d146101b257806315f0c220146101ba57005b3661013f57005b005b34801561014d57600080fd5b5060095461015b9060ff1681565b60405190151581526020015b60405180910390f35b34801561017c57600080fd5b50610185610400565b6040516101679190610d68565b34801561019e57600080fd5b5061015b6101ad366004610dd2565b610492565b61013f6104ac565b3480156101c657600080fd5b506101d060075481565b604051908152602001610167565b3480156101ea57600080fd5b506002546101d0565b3480156101ff57600080fd5b5061015b61020e366004610dfc565b6105c2565b34801561021f57600080fd5b5060405160008152602001610167565b34801561023b57600080fd5b506101d0621312d081565b34801561025257600080fd5b506101d06105e6565b34801561026757600080fd5b506101d060065481565b34801561027d57600080fd5b5061013f61028c366004610e38565b610603565b34801561029d57600080fd5b506101d06102ac366004610e51565b6001600160a01b031660009081526020819052604090205490565b3480156102d357600080fd5b5061013f6107f4565b3480156102e857600080fd5b506005546040516001600160a01b039091168152602001610167565b34801561031057600080fd5b50610185610808565b34801561032557600080fd5b5061015b610334366004610dd2565b610817565b34801561034557600080fd5b506101d06103e881565b34801561035b57600080fd5b506101d060085481565b34801561037157600080fd5b506101d0610380366004610e73565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b3480156103b757600080fd5b5061013f610825565b3480156103cc57600080fd5b5061013f6103db366004610ea6565b610869565b3480156103ec57600080fd5b5061013f6103fb366004610e51565b610950565b60606003805461040f90610ee9565b80601f016020809104026020016040519081016040528092919081815260200182805461043b90610ee9565b80156104885780601f1061045d57610100808354040283529160200191610488565b820191906000526020600020905b81548152906001019060200180831161046b57829003601f168201915b5050505050905090565b6000336104a081858561098b565b60019150505b92915050565b600034116104f15760405162461bcd60e51b815260206004820152600d60248201526c09aeae6e840e6cadcc8408aa89609b1b60448201526064015b60405180910390fd5b6000670de0b6b3a76400006105086103e834610f39565b6105129190610f50565b9050621312d08161052260025490565b61052c9190610f72565b111561057a5760405162461bcd60e51b815260206004820152601760248201527f576f756c6420657863656564206d617820737570706c7900000000000000000060448201526064016104e8565b610584338261099d565b604080513481526020810183905233917f8fafebcaf9d154343dad25669bfa277f4fbacd7ac6b0c4fed522580e040a0f33910160405180910390a250565b6000336105d08582856109d7565b6105db858585610a55565b506001949350505050565b60006105f160025490565b6105fe90621312d0610f85565b905090565b600081116106535760405162461bcd60e51b815260206004820152601d60248201527f416d6f756e74206d7573742062652067726561746572207468616e203000000060448201526064016104e8565b336000908152602081905260409020548111156106a95760405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b60448201526064016104e8565b60006103e86106c083670de0b6b3a7640000610f39565b6106ca9190610f50565b90508047101561071c5760405162461bcd60e51b815260206004820152601c60248201527f496e73756666696369656e742045544820696e20636f6e74726163740000000060448201526064016104e8565b6107263383610ab4565b604051600090339083908381818185875af1925050503d8060008114610768576040519150601f19603f3d011682016040523d82523d6000602084013e61076d565b606091505b50509050806107b45760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b60448201526064016104e8565b604080518481526020810184905233917f2dcf9433d75db0d8b1c172641f85e319ffe4ad22e108a95d1847ceb906e5195d910160405180910390a2505050565b6107fc610aea565b6108066000610b17565b565b60606004805461040f90610ee9565b6000336104a0818585610a55565b61082d610aea565b6005546040516001600160a01b03909116904780156108fc02916000818181858888f19350505050158015610866573d6000803e3d6000fd5b50565b610871610aea565b60095460ff16156108ce5760405162461bcd60e51b815260206004820152602160248201527f496e697469616c20646973747269627574696f6e20616c726561647920646f6e6044820152606560f81b60648201526084016104e8565b6108da8360065461099d565b6108e68260075461099d565b6108f28160085461099d565b6009805460ff19166001179055604080516001600160a01b038581168252848116602083015283168183015290517f4864f7df2cd1c07972b3dbf1a98de81ddd7d784caf0078d5e5e372b219f6695c916060908290030190a1505050565b610958610aea565b6001600160a01b03811661098257604051631e4fbdf760e01b8152600060048201526024016104e8565b61086681610b17565b6109988383836001610b69565b505050565b6001600160a01b0382166109c75760405163ec442f0560e01b8152600060048201526024016104e8565b6109d360008383610c3e565b5050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610a4f5781811015610a4057604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104e8565b610a4f84848484036000610b69565b50505050565b6001600160a01b038316610a7f57604051634b637e8f60e11b8152600060048201526024016104e8565b6001600160a01b038216610aa95760405163ec442f0560e01b8152600060048201526024016104e8565b610998838383610c3e565b6001600160a01b038216610ade57604051634b637e8f60e11b8152600060048201526024016104e8565b6109d382600083610c3e565b6005546001600160a01b031633146108065760405163118cdaa760e01b81523360048201526024016104e8565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038416610b935760405163e602df0560e01b8152600060048201526024016104e8565b6001600160a01b038316610bbd57604051634a1406b160e11b8152600060048201526024016104e8565b6001600160a01b0380851660009081526001602090815260408083209387168352929052208290558015610a4f57826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c3091815260200190565b60405180910390a350505050565b6001600160a01b038316610c69578060026000828254610c5e9190610f72565b90915550610cdb9050565b6001600160a01b03831660009081526020819052604090205481811015610cbc5760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016104e8565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610cf757600280548290039055610d16565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d5b91815260200190565b60405180910390a3505050565b600060208083528351808285015260005b81811015610d9557858101830151858201604001528201610d79565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610dcd57600080fd5b919050565b60008060408385031215610de557600080fd5b610dee83610db6565b946020939093013593505050565b600080600060608486031215610e1157600080fd5b610e1a84610db6565b9250610e2860208501610db6565b9150604084013590509250925092565b600060208284031215610e4a57600080fd5b5035919050565b600060208284031215610e6357600080fd5b610e6c82610db6565b9392505050565b60008060408385031215610e8657600080fd5b610e8f83610db6565b9150610e9d60208401610db6565b90509250929050565b600080600060608486031215610ebb57600080fd5b610ec484610db6565b9250610ed260208501610db6565b9150610ee060408501610db6565b90509250925092565b600181811c90821680610efd57607f821691505b602082108103610f1d57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176104a6576104a6610f23565b600082610f6d57634e487b7160e01b600052601260045260246000fd5b500490565b808201808211156104a6576104a6610f23565b818103818111156104a6576104a6610f2356fea2646970667358221220fdff3f7e18f2b17c9fddc7a9e3c3d13f47d41e8804703527bd42659cb05692bb64736f6c63430008140033";

type YiDengTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: YiDengTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class YiDengToken__factory extends ContractFactory {
  constructor(...args: YiDengTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      YiDengToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): YiDengToken__factory {
    return super.connect(runner) as YiDengToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YiDengTokenInterface {
    return new Interface(_abi) as YiDengTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): YiDengToken {
    return new Contract(address, _abi, runner) as unknown as YiDengToken;
  }
}
