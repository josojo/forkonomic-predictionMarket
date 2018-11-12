import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class Header extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { account: "0xd912AeCb07E9F4e1eA8E6b4779e7Fb6Aa1c3e4D8",
            dataKeyBranch: null,
            balance: null,
            dataKeyBalance: null };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const fSystem = drizzle.contracts.ForkonomicSystem;
    const fToken = drizzle.contracts.ForkonomicToken;
    // let drizzle know we want to watch the `myString` method
    const dataKeyBranch = fSystem.methods["genesisBranchHash"].cacheCall();

    const { ForkonomicSystem } = this.props.drizzleState.contracts;
    var branch = ForkonomicSystem.genesisBranchHash[this.state.dataKeyBranch];
    const account = drizzleState.accounts[0]
    //const balance = 1//fToken.methods.balanceOf.call(account, account, branch);
    branch = await fSystem.methods.genesisBranchHash().call()
    const balance = await fToken.methods.balanceOf(account, branch).call()
    const dataKeyBalance = 1
    // save the `dataKey` to local component state for later reference
    this.setState({ account: account, dataKeyBranch: dataKeyBranch, balance: balance, dataKeyBalance: dataKeyBalance});
  }

  render() {
    // get the contract state from drizzleState
    const { ForkonomicSystem } = this.props.drizzleState.contracts;
    const { ForkonomicToken } = this.props.drizzleState.contracts;
    // using the saved `dataKey`, get the variable we're interested in
    const branch = ForkonomicSystem.genesisBranchHash[this.state.dataKeyBranch];
    
    const account = "0xd912AeCb07E9F4e1eA8E6b4779e7Fb6Aa1c3e4D8"//drizzleState.accounts[0]
    const balance = this.state.balance;//ForkonomicToken.balanceOf[this.state.dataKeyBalance];//methods.balanceOf.call(account, branch);
    //const balance = ForkonomicToken.balanceOf[this.state.dataKeyBalance];
    // if it exists, then we display its value
    return(
      <div>
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
            <img src={ require('./fork.svg') } width="30" height="30" alt=""></img> 
            </a>
            <div align="left">  
              <span>Current branch:</span> 
              <input type="text" onChange={this.handleChange}  value={branch && branch.value}></input>

        </div>
        <div align="right">
               <span>Current balance: {balance} FT</span>       
               </div>
        </nav>
      </div>
    );
  }
}

export default Header;