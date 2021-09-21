/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProjectManager,
  ProjectManagerInterface,
} from "../ProjectManager";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_projectAddress",
        type: "address",
      },
    ],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_category",
        type: "string",
      },
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_goal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimestamp",
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
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "indexes",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "projects",
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
    inputs: [
      {
        internalType: "address payable",
        name: "_projectAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_category",
        type: "string",
      },
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_url",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_goal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "setInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalProjects",
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
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600181905550613d4b806100686000396000f3fe6080604052600436106200008b5760003560e01c806373e888fd116200005557806373e888fd14620004f0578063839a69cc14620005375780638da5cb5b146200076e5780639c361e4e14620007b25762000096565b8063107046bd146200009b578063188ec35614620001045780632427e59e14620001325780637142bc8314620002155762000096565b366200009657600080fd5b600080fd5b348015620000a857600080fd5b50620000d860048036036020811015620000c157600080fd5b8101908080359060200190929190505050620007e0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156200011157600080fd5b506200011c62000813565b6040518082815260200191505060405180910390f35b3480156200013f57600080fd5b50620001ff600480360360208110156200015857600080fd5b81019080803590602001906401000000008111156200017657600080fd5b8201836020820111156200018957600080fd5b80359060200191846001830284011164010000000083111715620001ac57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506200081b565b6040518082815260200191505060405180910390f35b3480156200022257600080fd5b50620004c4600480360360c08110156200023b57600080fd5b81019080803590602001906401000000008111156200025957600080fd5b8201836020820111156200026c57600080fd5b803590602001918460018302840111640100000000831117156200028f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115620002f357600080fd5b8201836020820111156200030657600080fd5b803590602001918460018302840111640100000000831117156200032957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156200038d57600080fd5b820183602082011115620003a057600080fd5b80359060200191846001830284011164010000000083111715620003c357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156200042757600080fd5b8201836020820111156200043a57600080fd5b803590602001918460018302840111640100000000831117156200045d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001909291908035906020019092919050505062000849565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b62000535600480360360208110156200050857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505062000e74565b005b3480156200054457600080fd5b506200076c600480360360c08110156200055d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156200059b57600080fd5b820183602082011115620005ae57600080fd5b80359060200191846001830284011164010000000083111715620005d157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156200063557600080fd5b8201836020820111156200064857600080fd5b803590602001918460018302840111640100000000831117156200066b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115620006cf57600080fd5b820183602082011115620006e257600080fd5b803590602001918460018302840111640100000000831117156200070557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001909291908035906020019092919050505062001081565b005b3480156200077b57600080fd5b50620007866200143b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b348015620007bf57600080fd5b50620007ca6200145f565b6040518082815260200191505060405180910390f35b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600042905090565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6000806002886040518082805190602001908083835b602083106200088457805182526020820191506020810190506020830392506200085f565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902054146200092c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f4964656e74696669657220616c7265616479206578697374732e00000000000081525060200191505060405180910390fd5b6000831162000987576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602481526020018062003cf26024913960400191505060405180910390fd5b428211620009e1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603081526020018062003cc26030913960400191505060405180910390fd5b6000868686868633604051620009f79062001465565b808060200180602001806020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184810384528a818151815260200191508051906020019080838360005b8381101562000a6657808201518184015260208101905062000a49565b50505050905090810190601f16801562000a945780820380516001836020036101000a031916815260200191505b50848103835289818151815260200191508051906020019080838360005b8381101562000acf57808201518184015260208101905062000ab2565b50505050905090810190601f16801562000afd5780820380516001836020036101000a031916815260200191505b50848103825288818151815260200191508051906020019080838360005b8381101562000b3857808201518184015260208101905062000b1b565b50505050905090810190601f16801562000b665780820380516001836020036101000a031916815260200191505b509950505050505050505050604051809103906000f08015801562000b8f573d6000803e3d6000fd5b5090506000819050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141562000c3b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f50726f6a656374206465706c6f796d656e74206661696c65642e00000000000081525060200191505060405180910390fd5b6000600180540190508060028b6040518082805190602001908083835b6020831062000c7d578051825260208201915060208101905060208303925062000c58565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902081905550816003600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550807f462874f953857c0e42e4c0f8845c092a5d3cc9863cec5998823ff45bc4af0b4b8a8a85336040518080602001806020018573ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff168152602001838103835287818151815260200191508051906020019080838360005b8381101562000daa57808201518184015260208101905062000d8d565b50505050905090810190601f16801562000dd85780820380516001836020036101000a031916815260200191505b50838103825286818151815260200191508051906020019080838360005b8381101562000e1357808201518184015260208101905062000df6565b50505050905090810190601f16801562000e415780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a26001600081548092919060010191905055508193505050509695505050505050565b6000341162000ecf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602481526020018062003c9e6024913960400191505060405180910390fd5b60008190503073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663481c6a756040518163ffffffff1660e01b815260040160206040518083038186803b15801562000f3257600080fd5b505afa15801562000f47573d6000803e3d6000fd5b505050506040513d602081101562000f5e57600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff161462000ff9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f496e76616c69642070726f6a6563742e0000000000000000000000000000000081525060200191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166373e888fd34336040518363ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303818588803b1580156200106357600080fd5b505af115801562001078573d6000803e3d6000fd5b50505050505050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161462001143576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f4f6e6c79206f776e65722e00000000000000000000000000000000000000000081525060200191505060405180910390fd5b60008690503073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663481c6a756040518163ffffffff1660e01b815260040160206040518083038186803b158015620011a657600080fd5b505afa158015620011bb573d6000803e3d6000fd5b505050506040513d6020811015620011d257600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff16146200126d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f496e76616c69642070726f6a6563742e0000000000000000000000000000000081525060200191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16631916403a87878787876040518663ffffffff1660e01b815260040180806020018060200180602001868152602001858152602001848103845289818151815260200191508051906020019080838360005b83811015620012f3578082015181840152602081019050620012d6565b50505050905090810190601f168015620013215780820380516001836020036101000a031916815260200191505b50848103835288818151815260200191508051906020019080838360005b838110156200135c5780820151818401526020810190506200133f565b50505050905090810190601f1680156200138a5780820380516001836020036101000a031916815260200191505b50848103825287818151815260200191508051906020019080838360005b83811015620013c5578082015181840152602081019050620013a8565b50505050905090810190601f168015620013f35780820380516001836020036101000a031916815260200191505b5098505050505050505050600060405180830381600087803b1580156200141957600080fd5b505af11580156200142e573d6000803e3d6000fd5b5050505050505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b61282a80620014748339019056fe60806040523480156200001157600080fd5b506040516200282a3803806200282a833981810160405260c08110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b838201915060208201858111156200006f57600080fd5b82518660018202830111640100000000821117156200008d57600080fd5b8083526020830192505050908051906020019080838360005b83811015620000c3578082015181840152602081019050620000a6565b50505050905090810190601f168015620000f15780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200011557600080fd5b838201915060208201858111156200012c57600080fd5b82518660018202830111640100000000821117156200014a57600080fd5b8083526020830192505050908051906020019080838360005b838110156200018057808201518184015260208101905062000163565b50505050905090810190601f168015620001ae5780820380516001836020036101000a031916815260200191505b5060405260200180516040519392919084640100000000821115620001d257600080fd5b83820191506020820185811115620001e957600080fd5b82518660018202830111640100000000821117156200020757600080fd5b8083526020830192505050908051906020019080838360005b838110156200023d57808201518184015260208101905062000220565b50505050905090810190601f1680156200026b5780820380516001836020036101000a031916815260200191505b5060405260200180519060200190929190805190602001909291908051906020019092919050505073__$03536fd10dbb8a170600640c424d9e3a97$__63bed34bba876040518060400160405280600381526020017f4b494100000000000000000000000000000000000000000000000000000000008152506040518363ffffffff1660e01b8152600401808060200180602001838103835285818151815260200191508051906020019080838360005b83811015620003395780820151818401526020810190506200031c565b50505050905090810190601f168015620003675780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b83811015620003a257808201518184015260208101905062000385565b50505050905090810190601f168015620003d05780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b158015620003f057600080fd5b505af415801562000405573d6000803e3d6000fd5b505050506040513d60208110156200041c57600080fd5b810190808051906020019092919050505080620005cf575073__$03536fd10dbb8a170600640c424d9e3a97$__63bed34bba876040518060400160405280600381526020017f414f4e00000000000000000000000000000000000000000000000000000000008152506040518363ffffffff1660e01b8152600401808060200180602001838103835285818151815260200191508051906020019080838360005b83811015620004da578082015181840152602081019050620004bd565b50505050905090810190601f168015620005085780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156200054357808201518184015260208101905062000526565b50505050905090810190601f168015620005715780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b1580156200059157600080fd5b505af4158015620005a6573d6000803e3d6000fd5b505050506040513d6020811015620005bd57600080fd5b81019080805190602001909291905050505b62000642576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601c8152602001807f43617465676f7279206d757374206265204b4941206f7220414f4e2e0000000081525060200191505060405180910390fd5b600083116200069d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180620028066024913960400191505060405180910390fd5b428211620006f7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526030815260200180620027d66030913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156200079b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f43726561746f722061646472657373206d7573742062652076616c69642e000081525060200191505060405180910390fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040518060c001604052808781526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff16815250600660008201518160000190805190602001906200083e929190620008ff565b5060208201518160010190805190602001906200085d929190620008ff565b5060408201518160020190805190602001906200087c929190620008ff565b50606082015181600301556080820151816004015560a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050600060018190555060006002819055506000600381905550505050505050620009b5565b828054600181600116156101000203166002900490600052602060002090601f01602090048101928262000937576000855562000983565b82601f106200095257805160ff191683800117855562000983565b8280016001018555821562000983579182015b828111156200098257825182559160200191906001019062000965565b5b50905062000992919062000996565b5090565b5b80821115620009b157600081600090555060010162000997565b5090565b611e1180620009c56000396000f3fe6080604052600436106100c65760003560e01c8063590e1ae31161007f57806373e888fd1161005957806373e888fd146107a2578063cef42254146107e6578063f251fc8c14610852578063fe47a8a71461087d576100d0565b8063590e1ae3146105af5780635a9b0b89146105c657806363bd1d4a1461078b576100d0565b80631916403a146100d55780631cee0700146102df5780631f6d49421461034b578063370158ea146103b057806337c0892314610543578063481c6a751461056e576100d0565b366100d057600080fd5b600080fd5b3480156100e157600080fd5b506102dd600480360360a08110156100f857600080fd5b810190808035906020019064010000000081111561011557600080fd5b82018360208201111561012757600080fd5b8035906020019184600183028401116401000000008311171561014957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156101ac57600080fd5b8201836020820111156101be57600080fd5b803590602001918460018302840111640100000000831117156101e057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561024357600080fd5b82018360208201111561025557600080fd5b8035906020019184600183028401116401000000008311171561027757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190929190803590602001909291905050506108a8565b005b3480156102eb57600080fd5b506103186004803603602081101561030257600080fd5b8101908080359060200190929190505050610be4565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b34801561035757600080fd5b5061039a6004803603602081101561036e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c28565b6040518082815260200191505060405180910390f35b3480156103bc57600080fd5b506103c5610c40565b604051808060200180602001806020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184810384528a818151815260200191508051906020019080838360005b8381101561043557808201518184015260208101905061041a565b50505050905090810190601f1680156104625780820380516001836020036101000a031916815260200191505b50848103835289818151815260200191508051906020019080838360005b8381101561049b578082015181840152602081019050610480565b50505050905090810190601f1680156104c85780820380516001836020036101000a031916815260200191505b50848103825288818151815260200191508051906020019080838360005b838110156105015780820151818401526020810190506104e6565b50505050905090810190601f16801561052e5780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b34801561054f57600080fd5b50610558610e52565b6040518082815260200191505060405180910390f35b34801561057a57600080fd5b50610583610e58565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156105bb57600080fd5b506105c4610e7c565b005b3480156105d257600080fd5b506105db611152565b604051808060200180602001806020018b81526020018a81526020018973ffffffffffffffffffffffffffffffffffffffff1681526020018881526020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184810384528e818151815260200191508051906020019080838360005b8381101561067957808201518184015260208101905061065e565b50505050905090810190601f1680156106a65780820380516001836020036101000a031916815260200191505b5084810383528d818151815260200191508051906020019080838360005b838110156106df5780820151818401526020810190506106c4565b50505050905090810190601f16801561070c5780820380516001836020036101000a031916815260200191505b5084810382528c818151815260200191508051906020019080838360005b8381101561074557808201518184015260208101905061072a565b50505050905090810190601f1680156107725780820380516001836020036101000a031916815260200191505b509d505050505050505050505050505060405180910390f35b34801561079757600080fd5b506107a06113c1565b005b6107e4600480360360208110156107b857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118aa565b005b3480156107f257600080fd5b5061081f6004803603602081101561080957600080fd5b8101908080359060200190929190505050611c45565b604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b34801561085e57600080fd5b50610867611cde565b6040518082815260200191505060405180910390f35b34801561088957600080fd5b50610892611ce4565b6040518082815260200191505060405180910390f35b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16148061095257503373ffffffffffffffffffffffffffffffffffffffff16600660050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b6109c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f4f6e6c79206d616e61676572206f722063726561746f722e000000000000000081525060200191505060405180910390fd5b83600660010190805190602001906109dd929190611cea565b5082600660020190805190602001906109f7929190611cea565b503373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610a7b578460066000019080519060200190610a65929190611cea565b5081600660030181905550806006600401819055505b3073ffffffffffffffffffffffffffffffffffffffff167f7d77f3037891fe41170339c711c0f173bedef7a57e8284672c27bb61e478150a60066001016006600201604051808060200180602001838103835285818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610b4a5780601f10610b1f57610100808354040283529160200191610b4a565b820191906000526020600020905b815481529060010190602001808311610b2d57829003601f168201915b5050838103825284818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610bcd5780601f10610ba257610100808354040283529160200191610bcd565b820191906000526020600020905b815481529060010190602001808311610bb057829003601f168201915b505094505050505060405180910390a25050505050565b60056020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154905082565b60046020528060005260406000206000915090505481565b6006806000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cda5780601f10610caf57610100808354040283529160200191610cda565b820191906000526020600020905b815481529060010190602001808311610cbd57829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d785780601f10610d4d57610100808354040283529160200191610d78565b820191906000526020600020905b815481529060010190602001808311610d5b57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e165780601f10610deb57610100808354040283529160200191610e16565b820191906000526020600020905b815481529060010190602001808311610df957829003601f168201915b5050505050908060030154908060040154908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905086565b60015481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b426006600401541115610ef7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f4f6e6c7920657870697265642e0000000000000000000000000000000000000081525060200191505060405180910390fd5b60066003015460035410610f73576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f46756e64696e6720676f616c20686173206265656e20726561636865642e000081525060200191505060405180910390fd5b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081111561114f576000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060003373ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d8060008114611065576040519150601f19603f3d011682016040523d82523d6000602084013e61106a565b606091505b50509050806110e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4661696c656420746f2073656e6420616d6f756e742e0000000000000000000081525060200191505060405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff167f8acf4934346d52d5e66a4489928806be024d6d8d3db9110a0c946f23bb67a6853384604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a2505b50565b60608060606000806000806000806000600660000160066001016006600201600660030154600660040154600660050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660015460025460035460008054906101000a900473ffffffffffffffffffffffffffffffffffffffff16898054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112625780601f1061123757610100808354040283529160200191611262565b820191906000526020600020905b81548152906001019060200180831161124557829003601f168201915b50505050509950888054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112fe5780601f106112d3576101008083540402835291602001916112fe565b820191906000526020600020905b8154815290600101906020018083116112e157829003601f168201915b50505050509850878054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561139a5780601f1061136f5761010080835404028352916020019161139a565b820191906000526020600020905b81548152906001019060200180831161137d57829003601f168201915b50505050509750995099509950995099509950995099509950995090919293949596979899565b3373ffffffffffffffffffffffffffffffffffffffff16600660050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611487576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f4f6e6c792063726561746f722e0000000000000000000000000000000000000081525060200191505060405180910390fd5b426006600401541115611502576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f4f6e6c7920657870697265642e0000000000000000000000000000000000000081525060200191505060405180910390fd5b600073__$03536fd10dbb8a170600640c424d9e3a97$__63bed34bba60066000016040518060400160405280600381526020017f414f4e00000000000000000000000000000000000000000000000000000000008152506040518363ffffffff1660e01b81526004018080602001806020018381038352858181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156115f55780601f106115ca576101008083540402835291602001916115f5565b820191906000526020600020905b8154815290600101906020018083116115d857829003601f168201915b5050838103825284818151815260200191508051906020019080838360005b8381101561162f578082015181840152602081019050611614565b50505050905090810190601f16801561165c5780820380516001836020036101000a031916815260200191505b5094505050505060206040518083038186803b15801561167b57600080fd5b505af415801561168f573d6000803e3d6000fd5b505050506040513d60208110156116a557600080fd5b81019080805190602001909291905050509050801561171f57600660030154600354101561171e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180611d966022913960400191505060405180910390fd5b5b6000600354905060008111156118a65760006003819055506000600660050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405180600001905060006040518083038185875af1925050503d80600081146117bc576040519150601f19603f3d011682016040523d82523d6000602084013e6117c1565b606091505b5050905080611838576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4661696c656420746f2073656e6420616d6f756e742e0000000000000000000081525060200191505060405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff167faeafd3f12e55085474a74a4ee382b64d62a256ea1d447e40e412df48abb17e5d3384604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a2505b5050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461196b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f4f6e6c79206d616e616765722e0000000000000000000000000000000000000081525060200191505060405180910390fd5b600034116119c4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180611db86024913960400191505060405180910390fd5b426006600401541015611a3f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f50726f6a6563742068617320657870697265642e00000000000000000000000081525060200191505060405180910390fd5b60006005600060015481526020019081526020016000206040518060400160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600182015481525050905081816000019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050348160200181815250506000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905034600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055506000811415611bb2576002600081548092919060010191905055505b346003600082825401925050819055506001600081548092919060010191905055503073ffffffffffffffffffffffffffffffffffffffff167fe482e8d853bcf23b76d7656a12af7c09cc6820a4683d6c48851261c2b12323b38434604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a2505050565b6000806000600560008581526020019081526020016000206040518060400160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820154815250509050806000015181602001519250925050915091565b60025481565b60035481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282611d205760008555611d67565b82601f10611d3957805160ff1916838001178555611d67565b82800160010185558215611d67579182015b82811115611d66578251825591602001919060010190611d4b565b5b509050611d749190611d78565b5090565b5b80821115611d91576000816000905550600101611d79565b509056fe46756e64696e6720676f616c20686173206e6f74206265656e20726561636865642e436f6e747269627574696f6e206d7573742062652067726561746572207468616e20302ea2646970667358221220ca3771b4ea377350f7da4d037a70fb8c7d3baff6bc28259cdecadc19dad9b47f64736f6c63430007060033446561646c696e65206d7573742062652067726561746572207468616e2063757272656e742074696d657374616d702e46756e64696e6720676f616c206d7573742062652067726561746572207468616e20302e436f6e747269627574696f6e206d7573742062652067726561746572207468616e20302e446561646c696e65206d7573742062652067726561746572207468616e2063757272656e742074696d657374616d702e46756e64696e6720676f616c206d7573742062652067726561746572207468616e20302ea264697066735822122047309de18ffd36bd990a8159850c81aa4840886e3b59d5b70135f7b5ec0ca91a64736f6c63430007060033";

export class ProjectManager__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: ProjectManagerLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      ProjectManager__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: ProjectManagerLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$03536fd10dbb8a170600640c424d9e3a97\\$__", "g"),
      linkLibraryAddresses["src/Utils.sol:Utils"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProjectManager> {
    return super.deploy(overrides || {}) as Promise<ProjectManager>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ProjectManager {
    return super.attach(address) as ProjectManager;
  }
  connect(signer: Signer): ProjectManager__factory {
    return super.connect(signer) as ProjectManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProjectManagerInterface {
    return new utils.Interface(_abi) as ProjectManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProjectManager {
    return new Contract(address, _abi, signerOrProvider) as ProjectManager;
  }
}

export interface ProjectManagerLibraryAddresses {
  ["src/Utils.sol:Utils"]: string;
}
