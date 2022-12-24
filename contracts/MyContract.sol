pragma solidity ^0.8.0;

interface IERC20 {
	// function name() public view returns (string);

	// function symbol() public view returns (string);

	// function decimals() public view returns (uint8);

	// function totalSupply() external view returns (uint256); // Tong cong bao nhieu token luu thong

	function balanceOf(address account) external view returns (uint256); // User account co bao nhieu token

	function allowance(
		address owner,
		address spender // spender dang co quyen dung bao nhieu token cua owner
	) external view returns (uint256);

	function transfer(
		address recipient,
		uint256 amount // Chuyen tu nguoi sender sang recipient
	) external returns (bool);

	function approve(address spender, uint256 amount) external returns (bool); // Dong y cho ai sai token

	function transferFrom(
		address sender,
		address recipient,
		uint256 amount
	) external returns (bool); // Chuyen tien, dung smart contract

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(
		address indexed owner,
		address indexed spender,
		uint256 value
	);
}

contract MyContract is IERC20 {
	string public constant name = "SANTA";
	string public constant symbol = "SANTA";
	uint8 public constant decimals = 18;
	uint256 public constant _totalSupply = 10 ether; // 10*10^18
	mapping(address => uint256) balances;
	mapping(address => mapping(address => uint256)) allowed;
	address author;

	// event Transfer(address indexed from, address indexed to, uint256 value);
	// event Approval(
	// 	address indexed owner,
	// 	address indexed spender,
	// 	uint256 value
	// );

	constructor() {
		balances[msg.sender] = 10 ether;
		author = msg.sender;
	}

	function totalSupply() external view returns (uint256) {
		return _totalSupply + 100;
	}

	function balanceOf(address account)
		external
		view
		override
		returns (uint256)
	{
		return balances[account];
	}

	function transfer(
		address recipient,
		uint256 amount // Chuyen tu nguoi sender sang recipient
	) external override returns (bool) {
		// Check nguoi nay du tien ko
		require(amount < balances[msg.sender]);
		require(msg.sender == author);
		uint256 tax = (amount * 100) / 2; // 2% tren moi giao dich

		balances[msg.sender] = balances[msg.sender] - amount;
		balances[recipient] = balances[recipient] + amount - tax;

		balances[author] += tax;

		emit Transfer(msg.sender, recipient, amount);
		return true;
	}

	function approve(address spender, uint256 amount)
		external
		override
		returns (bool)
	{
		allowed[msg.sender][spender] = amount;

		emit Approval(msg.sender, spender, amount);
		return true;
	}

	function transferFrom(
		address sender, // Thanh, nguoi uy quen
		address recipient, // Nguoi nhan tien
		uint256 amount // So luong
	) external override returns (bool) {
		require(amount < balances[sender]);
		require(amount < allowed[sender][msg.sender]);

		balances[sender] -= amount;
		balances[recipient] += amount;

		allowed[sender][msg.sender] -= amount;

		emit Transfer(sender, recipient, amount);
		return true;
	}

	function allowance(
		address owner,
		address spender // spender dang co quyen dung bao nhieu token cua owner
	) external view override returns (uint256) {
		return allowed[owner][spender];
	}
}
