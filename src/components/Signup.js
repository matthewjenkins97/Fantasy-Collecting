import React, {Component} from 'react';
import ChatApp from './ChatApp';

class  Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({username: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.username);
    }
    render() {
        return(
            <div className="form-container">
                <ChatApp />
            </div>
        )
    }
}
export default Signup;