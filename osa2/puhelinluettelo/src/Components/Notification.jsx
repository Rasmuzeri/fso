const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  
  const className = `notification ${message.type}`

  return (
    <div className={className}>
      {message.text}
    </div>
  )
}

export default Notification