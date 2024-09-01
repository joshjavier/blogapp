const LoginForm = ({ onSubmit, onChange, username, password }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="input-username">username</label>
        {' '}
        <input
          type="text"
          id="input-username"
          name="username"
          value={username}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="input-password">password</label>
        {' '}
        <input
          type="password"
          id="input-password"
          name="password"
          value={password}
          onChange={onChange}
        />
      </div>
      <button>log in</button>
    </form>
  )
}

export default LoginForm
