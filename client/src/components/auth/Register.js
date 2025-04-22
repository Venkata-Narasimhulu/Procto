import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      userType: false,
      collegeId: "",
      errors: {},
      showPassword: false,
      showPassword2: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onToggle = e => {
    this.setState({ [e.target.id]: !this.state.userType });
  };

  togglePasswordVisibility = field => {
    this.setState(prevState => ({
      [field]: !prevState[field]
    }));
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      userType: this.state.userType,
      collegeId: this.state.collegeId
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors, showPassword, showPassword2 } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4><b>Register</b> below</h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>

            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", { invalid: errors.name })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>

              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", { invalid: errors.email })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>

              {/* 🔐 Password Field */}
              <div className="input-field col s12" style={{ position: "relative" }}>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={classnames("", { invalid: errors.password })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
                <i
                  className="material-icons"
                  onClick={() => this.togglePasswordVisibility("showPassword")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer",
                    color: "#1976d2"
                  }}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </i>
              </div>

              {/* 🔐 Confirm Password Field */}
              <div className="input-field col s12" style={{ position: "relative" }}>
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type={showPassword2 ? "text" : "password"}
                  className={classnames("", { invalid: errors.password2 })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
                <i
                  className="material-icons"
                  onClick={() => this.togglePasswordVisibility("showPassword2")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    cursor: "pointer",
                    color: "#1976d2"
                  }}
                >
                  {showPassword2 ? "visibility_off" : "visibility"}
                </i>
              </div>

              {/* 🏫 College ID */}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.collegeId}
                  error={errors.collegeId}
                  id="collegeId"
                  type="text"
                  className={classnames("", { invalid: errors.collegeId })}
                />
                <label htmlFor="collegeId">College ID</label>
                <span className="red-text">{errors.collegeId}</span>
              </div>

              {/* 🧑‍🏫 Instructor Toggle */}
              <div className="switch col s12">
                <label>
                  Are you an instructor?
                  <input
                    type="checkbox"
                    id="userType"
                    checked={this.state.userType}
                    onChange={this.onToggle}
                  />
                  <span className="lever"></span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
