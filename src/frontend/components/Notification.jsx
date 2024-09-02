const Notification = ({ errorMessage }) => {
  return (
    <div role="alert" className={errorMessage?.success && 'success'}>
      {errorMessage?.body}
    </div>
  )
}

export default Notification
