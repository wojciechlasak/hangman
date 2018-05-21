import React, { Component } from 'react';
import './App.css';

class Game extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			active: true,
			pass: "",
		};
		this.child = React.createRef();
	}

	handleKeyPress = (event) => {
		if(event.key === 'Enter')
			this.handleClick();
	}

	handleChangedText =(changeText => {this.child.current.change2(changeText,this.state.pass)});

	handleClick = () => {
		this.setState({
			active: false,
			pass: document.getElementById("input").value.toUpperCase(),
		});
		this.child.current.change(document.getElementById("input").value.toUpperCase());

	}
	
	render(){
		return(
			<div>
				<div id="input-container"  className={!this.state.active ? 'hidden': ''}></div>
				<div id="input-box" className={!this.state.active ? 'hidden': ''} >
					<div id='input-bar'>
						<input type="password" id='input'  onKeyPress={this.handleKeyPress}/>
					</div>
					<div id='input-submit'>
						<input type="submit" value="Wprowadź" id="button"
						 onClick={this.handleClick}/>
					</div>
				</div>
				<Mid ref={this.child}  pass={this.state.pass} onChangedText={this.handleChangedText}/>
			</div>
		);

	}
}

class Footer extends React.Component {
	render(){
		return(
			<div className="part">
				<div id="footer">
					<p>{`<!--Sam sobie grę zrobiłem-->`}</p>
				</div>
			</div>
		);

	}
}


class Mid extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			amount: 0,
			hidden: false,
			passHash: '',
			win: false,
		}
	}

	change = (newPass) => {
		var temp = "";
		for (let i=0; i<newPass.length; i++){
			if (newPass.charAt(i)===" ") temp = temp + " ";
			else temp = temp + "_";
		}
		this.setState({passHash: temp});
	}
	
	change2 = (index,pass) => {
		var temp = this.state.passHash;
		for(let i=0; i<pass.length; i++)
			if (pass.charAt(i) === String.fromCharCode(index+65) ){
				temp = temp.substr(0, i) + String.fromCharCode(index+65) + temp.substr(i+1);
			}
		this.setState({passHash: temp});
		if(pass===temp){
			this.setState({
				win: true,
				hidden:true,
			});
		}
	}

	handleChangedImage =(changeImage => {
		const temp = this.state.amount+1;
		this.setState({amount: temp});
		if(this.state.amount>4){
			this.setState({hidden: true});
		}
	});

	onChangedText= (props => {this.props.onChangedText(this.props.id)});

	render(){
		return(
			<div className="part"> 
				<div id="header">
					<div id="password">
						{this.state.passHash}
					</div>
				</div>
				{!this.state.hidden
				? //if yes
				<div id="mid">
					<div id="image">
						{ <img src={'/img/s'+this.state.amount+'.jpg'} alt="wisielec animate"/> }
					</div>
					<div id="letter-container">
						<Letters pass={this.props.pass} onChangedText={this.props.onChangedText}  onChangedImage={this.handleChangedImage}/>
					</div>
				</div>
				: //if not
				<div id='mid-end'>{this.state.win?'Wygrana!':'Przegrana!'}
					<div id='mid-end-again' onClick={() => window.location.reload()}>Zagraj ponownie</div>
				</div>}
			</div>
		);
	
	}
}


class Letters extends React.Component {
	constructor(props) {
		super(props)
	}

	onChangedImage = () => {this.props.onChangedImage()}

	onChangedText= (props => {this.props.onChangedText(this.props.id)});
	
	createTable = () => {
			let table = [];
			for (let i = 0; i <26; i++) 
				table.push(<Letter ket={i} id={i} pass={this.props.pass} onChangedText={this.props.onChangedText} onChangedImage={this.props.onChangedImage}/>);
				
			return table
	  }
	 render(){return(this.createTable());}

}

class Letter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			correct: false,
		};
	}
	onChangedText = (props => {this.props.onChangedText(this.props.id)});

	onChangedImage = () => {this.props.onChangedImage()}

	handleClick = () => {
		this.setState({ active: true });

		var hit = false;
		for(let i=0; i<this.props.pass.length; i++)
			if (this.props.pass.charAt(i) === String.fromCharCode(this.props.id+65) )
				hit = true;
		
		if(hit){
			this.setState({ correct: true });
			this.props.onChangedText(this.props.id)
		}else{
			this.setState({ correct: false });
			this.props.onChangedImage();
		}
	}

	render(){
		return(
			<div className={`letter-button ${this.state.active ? this.state.correct ? 'letter-button-green' : 'letter-button-red': ''} `} 
	   		 keyid={this.props.id}
			onClick={!this.state.active ? this.handleClick : ';'}>
				{String.fromCharCode(this.props.id+65)}
			</div>
		);
	
	}
}


class App extends Component {
  render() {
    return (
		<div id="container">
			<Game />
			<Footer />
		</div>
    );
  }
}

export default App;